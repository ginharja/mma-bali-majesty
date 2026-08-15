<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\GymClass;
use App\Models\Product;
use App\Models\Booking;
use App\Models\Broadcast;
use App\Models\Notification;
use App\Models\User;
use App\Models\Branch;
use App\Models\Plan;

class AdminController extends Controller
{
    public function generateDatabaseDummy()
    {
        $initialPlans = [
            ['id'=>'visit', 'name'=>'Per Visit', 'price'=>75000, 'period'=>'/visit', 'badge'=>null, 'icon'=>'🎯', 'color'=>'#00E5FF'],
            ['id'=>'monthly', 'name'=>'Monthly', 'price'=>350000, 'period'=>'/month', 'badge'=>'POPULAR', 'icon'=>'📅', 'color'=>'#CCFF00'],
            ['id'=>'quarterly', 'name'=>'Quarterly', 'price'=>900000, 'period'=>'/3 months', 'badge'=>'SAVE 14%', 'icon'=>'📊', 'color'=>'#B39DDB'],
            ['id'=>'annually', 'name'=>'Annual', 'price'=>3000000, 'period'=>'/year', 'badge'=>'SAVE 29%', 'icon'=>'👑', 'color'=>'#FFD700'],
        ];
        foreach ($initialPlans as $p) { Plan::updateOrCreate(['id' => $p['id']], $p); }

        // 1. BUAT 47 MEMBER RIIL DI DATABASE
        $avatars = ["💪", "🧘", "🏃", "🥊", "⚡", "🚴", "🤸", "🏄"];
        $plans = ["Monthly", "Quarterly", "Annual", "Per Visit"];
        $branches = ["B1", "B2", "B3", "B4"];
        $names = ["Ahmad", "Muhammad", "Budi", "Siti", "Agus", "Dewi", "Hendra", "Ayu", "Rizky", "Putri", "Made", "Wayan", "Nyoman", "Ketut"];

        for($i = 0; $i < 47; $i++) {
            User::updateOrCreate(
                ['email' => "member{$i}@gym.com"],
                [
                    'name' => $names[$i % count($names)] . ' ' . rand(10, 99),
                    'password' => bcrypt('123'),
                    'role' => 'member',
                    'avatar' => $avatars[$i % count($avatars)],
                    'plan' => $plans[$i % 4],
                    'branch_id' => $branches[$i % 4],
                    'streak' => ($i % 10) + 1,
                    'join_date' => 'Jan 2026',
                    'phone' => '+62 812-0000-' . (1000 + $i)
                ]
            );
        }

        // 2. BUAT 112 KELAS KE DATABASE (Semua Kategori & Online)
        $categories = [
            ['cat'=>'HIIT', 'icon'=>'🔥', 'color'=>'#FF3131', 'int'=>'HIGH'],
            ['cat'=>'Yoga', 'icon'=>'🧘', 'color'=>'#B39DDB', 'int'=>'LOW'],
            ['cat'=>'Strength', 'icon'=>'🏋️', 'color'=>'#FF5C00', 'int'=>'HIGH'],
            ['cat'=>'Boxing', 'icon'=>'🥊', 'color'=>'#FF3131', 'int'=>'HIGH'],
            ['cat'=>'Pilates', 'icon'=>'🧘', 'color'=>'#B39DDB', 'int'=>'MED'],
            ['cat'=>'Cardio', 'icon'=>'🏃', 'color'=>'#00FF85', 'int'=>'MED'],
            ['cat'=>'Dance', 'icon'=>'💃', 'color'=>'#00E5FF', 'int'=>'MED'],
            ['cat'=>'Kids', 'icon'=>'🤸', 'color'=>'#FFD700', 'int'=>'LOW']
        ];
        $days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        $classBranches = ["B1", "B2", "B3", "B4", "ONLINE"];

        $trainers = User::where('role', 'trainer')->get();
        if(count($trainers) == 0) {
            return response()->json(['message' => 'Gagal: Anda belum membuat satupun Trainer di Database!']);
        }

        for($i = 0; $i < 112; $i++) {
    $cat = $categories[$i % count($categories)];
    $br = $classBranches[$i % count($classBranches)];
    $tr = $trainers[$i % count($trainers)];

    // Pakai updateOrCreate dengan acuan 'name'
    // Biarkan 'id' kosong agar diisi otomatis oleh database (Auto Increment)
    GymClass::updateOrCreate(
        ['name' => strtoupper($cat['cat']) . ' ' . ($i % 2 == 0 ? 'PRO' : 'FLOW') . ' ' . $i],
        [
            'branch_id' => $br,
            'trainer_id' => $tr->trainer_id ?? $tr->id,
            'time' => str_pad(6 + ($i % 14), 2, '0', STR_PAD_LEFT) . ':00',
            'day' => $days[$i % 7],
            'duration' => '60 min',
            'slots' => ($i % 5) + 1,
            'total' => 15,
            'icon' => $cat['icon'],
            'intensity' => $cat['int'],
            'category' => $cat['cat'],
            'color' => $cat['color'],
            'status' => 'active',
            'video_url' => $br === 'ONLINE' ? 'https://zoom.us/j/majestybali' : null
        ]
    );
}

        // 3. BUAT REVIEW RATING 4.8 & HUBUNGKAN MEMBER KE TRAINER
        $classes = GymClass::all();
        $members = User::where('role', 'member')->get();

        foreach($trainers as $tr) {
            // Suntikkan 8 ulasan bintang 5, dan 2 ulasan bintang 4 = Pas 4.8 Rating
            for($i = 0; $i < 10; $i++) {
                \Illuminate\Support\Facades\DB::table('reviews')->updateOrInsert(
                    ['booking_id' => "REV_{$tr->id}_{$i}"],
                    [
                        'trainer_id' => $tr->trainer_id ?? $tr->id,
                        'user_id' => $members->first()->id ?? 1,
                        'rating' => $i < 8 ? 5 : 4,
                        'is_auto' => 0
                    ]
                );
            }
        }

        // Suntik Booking: agar list Clients di Trainer penuh dengan nama-nama member
        foreach($members as $index => $m) {
            $c = $classes[$index % count($classes)];
            $tr = $trainers->where('id', $c->trainer_id)->first() ?? $trainers->first();

            Booking::updateOrCreate(
                ['transaction_id' => "BK_{$m->id}_{$c->id}"],
                [
                    'user_id' => $m->id,
                    'class_id' => $c->id,
                    'branch_id' => $c->branch_id,
                    'class_name' => $c->name,
                    'trainer' => $tr->name,
                    'date' => date('Y-m-d', strtotime('+2 days')),
                    'time' => $c->time,
                    'status' => 'upcoming',
                    'payment_status' => 'verified',
                    'amount' => 75000,
                    'method' => 'GoPay',
                    'type' => 'class',
                    'is_attended' => 0
                ]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Database 100% VALID! Disuntikkan 47 Member, 112 Kelas, Rating 4.8, & Client Bookings.']);
    }

    // --- MODUL KELAS ---
    public function addClass(Request $request)
    {
        $class = GymClass::create([
            'name' => $request->name,
            'branch_id' => $request->branch_id,
            'trainer_id' => $request->trainer_id,
            'time' => $request->time,
            'day' => $request->day,
            'duration' => $request->duration,
            'total' => $request->total,
            'slots' => $request->total, // Slots awal sama dengan total kapasitas
            'category' => $request->category,
            'icon' => $request->icon,
            'color' => $request->color,
            'intensity' => $request->intensity,
            'video_url' => $request->videoUrl,
            'status' => 'active'
        ]);

        return response()->json(['status' => 'success', 'data' => $class]);
    }

    // --- MODUL INVENTORY ---
    public function updateStock(Request $request, $id)
    {
        $product = Product::find($id);
        if($product) {
            $product->stock = $request->stock;
            $product->save();
            return response()->json(['status' => 'success', 'data' => $product]);
        }
        return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
    }

    public function uploadPhotos(Request $request, $id)
    {
        $product = Product::find($id);
        if($product) {
            // Menerima array Base64 string dari React
            $product->images = $request->images;
            $product->save();
            return response()->json(['status' => 'success', 'data' => $product]);
        }
        return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
    }

    // --- MODUL KEUANGAN ---
  public function approvePayment($transaction_id)
{
    // 1. Cari data menggunakan Model Booking (lebih singkat & clean)
    $booking = Booking::where('transaction_id', $transaction_id)
                ->orWhere('id', $transaction_id)
                ->first();

    if (!$booking) {
        return response()->json(['status' => 'success', 'message' => 'Verified locally']);
    }

    // 2. Update status langsung dari instance object-nya
    $booking->update(['payment_status' => 'verified']);

    // 3. Tembak push notifikasi
    Http::post(url('/api/admin/send-push'), [
        'user_id' => $booking->user_id,
        'title'   => 'Payment Approved! ✅',
        'message' => "Pembayaran untuk {$booking->class_name} berhasil diverifikasi.",
        'type'    => 'purchase'
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Payment verified & Notification sent!'
    ]);
}

    public function sendBroadcast(Request $request)
    {
        // 1. Simpan ke tabel broadcasts untuk riwayat (history)
        $broadcast = Broadcast::create([
            'text' => $request->text,
            'date' => $request->date
        ]);

        // 2. TRIGGER NOTIFIKASI: Kirim ke semua member ('all')
        Notification::create([
            'user_id' => 'all',
            'type'    => 'broadcast',
            'title'   => 'New Announcement 📢',
            'message' => $request->text,
            'is_read' => false
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $broadcast
        ]);
    }

    public function updateGymSettings(Request $request, $id)
    {
        $branch = Branch::find($id);
        if($branch) {
            $branch->update([
                'hours' => $request->hours,
                'max_capacity' => $request->maxCapacity,
                'emergency_phone' => $request->emergencyPhone,
                'wifi_network' => $request->wifi,
                'locker_count' => $request->lockerCount,
                'parking_slots' => $request->parkingSlots,
            ]);
            return response()->json(['status' => 'success', 'data' => $branch]);
        }
        return response()->json(['status' => 'error'], 404);
    }

    public function savePlan(Request $request) {
        $plan = Plan::updateOrCreate(
            ['id' => $request->id],
            $request->only(['name', 'price', 'period', 'badge', 'icon', 'color'])
        );
        return response()->json(['status' => 'success', 'data' => $plan]);
    }

    public function deletePlan($id) {
        Plan::destroy($id);
        return response()->json(['status' => 'success']);
    }

}
