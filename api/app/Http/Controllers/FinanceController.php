<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Product;

class FinanceController extends Controller
{
    public function getReport()
    {
        // Ambil SEMUA transaksi yang sudah diverifikasi (Kelas & Toko), urutkan dari terbaru
        $verifiedBookings = Booking::where('payment_status', 'verified')
                            ->orderBy('id', 'desc')
                            ->get();

        $totalRevenue = 0;
        $totalCost = 0;
        $history = [];

        foreach ($verifiedBookings as $b) {
            if ($b->type === 'purchase') {
                // Transaksi Produk Toko
                $product = Product::find($b->product_id);
                $cost = $product ? $product->cost : 0;
                $profit = $b->amount - $cost;

                $totalRevenue += $b->amount;
                $totalCost += $cost;

                $history[] = [
                    'id' => $b->transaction_id,
                    'name' => $b->class_name,
                    'type' => 'Store Item',
                    'profit' => $profit,
                    'date' => $b->date
                ];
            } else {
                // Transaksi Booking Kelas
                $totalRevenue += $b->amount;

                $history[] = [
                    'id' => $b->transaction_id,
                    'name' => $b->class_name,
                    'type' => 'Class Ticket',
                    'profit' => $b->amount, // Modal kelas dianggap 0 (pure profit)
                    'date' => $b->date
                ];
            }
        }

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_revenue' => $totalRevenue,
                'store_cost' => $totalCost,
                'net_profit' => $totalRevenue - $totalCost,
            ],
            'history' => $history
        ]);
    }
}
