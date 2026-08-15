<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GymClass;

class ClassController extends Controller
{
    // Tambah Kelas Baru
    public function addClass(Request $request)
    {
        $class = GymClass::create([
            'id' => $request->id,
            'branch_id' => $request->branchId,
            'name' => $request->name,
            'trainer_id' => $request->trainerId,
            'time' => $request->time,
            'day' => $request->day,
            'duration' => $request->duration,
            'total' => $request->total,
            'slots' => $request->total, // Saat baru dibuat, slot kosong = total kapasitas
            'icon' => $request->icon,
            'intensity' => $request->intensity,
            'category' => $request->category,
            'color' => $request->color,
            'status' => 'active',
            'video_url' => $request->videoUrl
        ]);

        return response()->json(['status' => 'success', 'data' => $class]);
    }

    // Edit Kelas
    public function updateClass(Request $request, $id)
    {
        $class = GymClass::find($id);
        if ($class) {
            $class->update([
                'name' => $request->name,
                'branch_id' => $request->branchId,
                'trainer_id' => $request->trainerId,
                'time' => $request->time,
                'day' => $request->day,
                'duration' => $request->duration,
                'total' => $request->total,
                // Jangan reset slots, tapi sesuaikan jika totalnya berubah drastis (opsional)
                'video_url' => $request->videoUrl
            ]);
            return response()->json(['status' => 'success', 'data' => $class]);
        }
        return response()->json(['status' => 'error', 'message' => 'Kelas tidak ditemukan'], 404);
    }

    // Toggle Status (Aktif <-> Dibatalkan)
    public function toggleClass($id)
    {
        $class = GymClass::find($id);
        if ($class) {
            $class->status = $class->status === 'active' ? 'cancelled' : 'active';
            $class->save();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }
}
