<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrainerLog;
use App\Models\ClientNote;
use App\Models\Booking;
use App\Models\Review;

class TrainerController extends Controller
{
    // 1. API untuk Shift Kerja (Clock In / Out)
    public function toggleShift(Request $request) {
        $log = TrainerLog::create([
            'trainer_id' => $request->trainer_id,
            'type'       => $request->type, // 'START' atau 'END'
            'time'       => now()
        ]);
        return response()->json(['status' => 'success', 'data' => $log]);
    }

    // 2. API untuk Tambah Catatan Klien
    public function addClientNote(Request $request) {
        $note = ClientNote::create([
            'trainer_id' => $request->trainer_id,
            'user_id'    => $request->user_id,
            'note'       => $request->note,
            'date'       => date('d M Y')
        ]);
        return response()->json(['status' => 'success', 'data' => $note]);
    }

    // 3. API untuk Absensi Murid di Kelas
    public function toggleAttendance($id) {
        $booking = Booking::where('transaction_id', $id)->first();
        if ($booking) {
            $booking->is_attended = !$booking->is_attended;
            $booking->save();
            return response()->json(['status' => 'success', 'is_attended' => $booking->is_attended]);
        }
        return response()->json(['status' => 'error', 'message' => 'Booking not found'], 404);
    }

    public function submitReview(Request $request) {
    $review = Review::create([
        'booking_id' => $request->booking_id,
        'user_id'    => $request->user_id,
        'trainer_id' => $request->trainer_id,
        'rating'     => $request->rating,
        'comment'    => $request->comment,
        'is_auto'    => false
    ]);
    return response()->json(['status' => 'success', 'data' => $review]);
}
}
