<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\GymClass;
use App\Models\Product;
use App\Models\User;
use App\Models\Transfer;
use App\Models\SupportTicket;
use App\Models\FitnessProgress;
use App\Models\Broadcast;
use App\Models\Badge;
use App\Models\Notification;
use App\Models\TrainerLog;
use App\Models\ClientNote;
use App\Models\Review;
use App\Models\Branch;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    //Fetch Data
    public function getInitialData()
    {
        $broadcasts = Broadcast::orderBy('id', 'desc')->get();
        $badges = Badge::all();

        return response()->json([
            'users' => User::all(),
            'branches' => Branch::all(),
            'classes' => GymClass::all(),
            'plan' => Plan::all(),
            'products' => Product::all(),
            'transfers' => Transfer::all(),
            'tickets' => SupportTicket::all(),
            'progress' => FitnessProgress::all(),
            'broadcasts' => $broadcasts,
            'badges' => $badges,
            'bookings' => Booking::all(),
            'trainer_shifts' => TrainerLog::all(),
            'client_notes' => ClientNote::all(),
            'reviews'      => Review::all()
        ]);
    }

    // API untuk Member Booking Kelas & Private
    public function bookClass(Request $request)
    {
        // 🟢 SKENARIO 1: BOOKING PRIVATE SESSION
        if ($request->type === 'private') {
            $booking = Booking::create([
                'transaction_id' => $request->transaction_id,
                'user_id' => $request->user_id,
                'class_id' => null,
                'branch_id' => $request->branch_id,
                'class_name' => $request->class_name,
                'trainer' => $request->trainer,
                'date' => $request->date,
                'time' => $request->time,
                'status' => 'upcoming',
                'payment_status' => $request->payment_status,
                'amount' => $request->amount,
                'method' => $request->method,
                'type' => 'private',
                'icon' => '💪',
                'description' => $request->description,
            ]);

            // 1. Notif ke Member (Pembeli)
            Notification::create([
                'user_id' => $request->user_id,
                'type'    => 'class',
                'title'   => 'Private Session Requested! 🥊',
                'message' => 'Your private session with ' . $request->trainer . ' is pending verification.',
                'is_read' => false
            ]);

            // 2. Notif ke Trainer yang dipilih
            // Cari ID user si pelatih berdasarkan namanya
            $trainerUser = User::where('name', $request->trainer)->where('role', 'trainer')->first();
            if ($trainerUser) {
                Notification::create([
                    'user_id' => $trainerUser->id,
                    'type'    => 'class',
                    'title'   => 'New Private Booking! 🎯',
                    'message' => 'A member requested a private session on ' . $request->date . ' at ' . $request->time . '.',
                    'is_read' => false
                ]);
            }

            // 3. Notif ke Super Admin
            $adminUser = User::where('role', 'admin')->first();
            if ($adminUser) {
                Notification::create([
                    'user_id' => $adminUser->id,
                    'type'    => 'purchase',
                    'title'   => 'Pending Payment 💳',
                    'message' => 'New private session payment requires verification.',
                    'is_read' => false
                ]);
            }

            return response()->json(['status' => 'success', 'data' => $booking]);
        }

        // 🔵 SKENARIO 2: BOOKING REGULAR CLASS
        $class = GymClass::find($request->class_id);
        $className = $class ? $class->name : 'Class';

        if ($class && $class->slots > 0) {
            $class->slots -= 1;
            $class->save();

            $booking = Booking::create([
                'transaction_id' => $request->transaction_id,
                'user_id' => $request->user_id,
                'class_id' => $class->id,
                'branch_id' => $class->branch_id,
                'class_name' => $class->name,
                'trainer' => $request->trainer,
                'date' => $request->date,
                'time' => $class->time,
                'status' => 'upcoming',
                'payment_status' => $request->payment_status,
                'amount' => $request->amount,
                'method' => $request->method,
                'type' => 'class',
                'icon' => $class->icon,
            ]);

            Notification::create([
                'user_id' => $request->user_id,
                'type'    => 'class',
                'title'   => 'Booking Received! 🏋️',
                'message' => 'Your spot for ' . $className . ' on ' . $request->date . ' is secured.',
                'is_read' => false
            ]);

            return response()->json(['status' => 'success', 'data' => $booking]);
        }

        return response()->json(['status' => 'error', 'message' => 'Kelas sudah penuh atau tidak ditemukan'], 400);
    }

    public function buyProduct(Request $request)
    {
        // 1. Validasi input dari aplikasi HP
        $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'method' => 'required'
        ]);

        try {
            // Gunakan fitur keamanan transaksi DB (Jika error, stok batal terpotong)
            DB::beginTransaction();

            // 2. Cek ketersediaan produk
            $product = Product::find($request->product_id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Produk tidak ditemukan.'
                ], 404);
            }

            if ($product->stock < $request->quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Maaf, stok produk tidak mencukupi. Sisa: ' . $product->stock
                ], 400);
            }

            // 3. Potong stok produk
            $product->stock -= $request->quantity;
            $product->save();

            // 4. Catat ke tabel bookings (sebagai transaksi produk)
            $booking = Booking::create([
                'transaction_id' => 'PRD-' . strtoupper(Str::random(8)),
                'user_id' => $request->user_id,
                'class_id' => null, // Kosong karena ini produk, bukan jadwal kelas
                'class_name' => $product->name, // Simpan nama produk di sini
                'type' => 'product', // Pembeda bahwa ini adalah pembelian barang
                'category' => 'shop',
                'icon' => '🛒',
                'amount' => $request->total_price,
                'method' => $request->method,
                'status' => 'pending', // Menunggu konfirmasi admin
                'payment_status' => 'unpaid',
                'date' => now()->format('Y-m-d'),
                'time' => now()->format('H:i'),
                'description' => 'Pembelian ' . $request->quantity . 'x ' . $product->name
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil memesan produk! Silakan bayar di kasir Gym.',
                'data' => $booking
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function shift(Request $request)
    {
        // Validasi data dari React
        $request->validate([
            'trainer_id' => 'required',
            'type' => 'required|in:START,END',
        ]);

        // Catat waktu server yang akurat saat ini
        $time = now()->format('Y-m-d H:i:s');

        try {
            // Simpan ke tabel 'trainer_logs' (karena modelnya TrainerLog)
            TrainerLog::create([
                'trainer_id' => $request->trainer_id,
                'type' => $request->type,
                'time' => $time,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => ['time' => $time]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
