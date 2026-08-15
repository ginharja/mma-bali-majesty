<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        // Cari user berdasarkan ID (pastikan ID dikirim dari React)
        $userId = str_replace('U', '', $request->id); // Menghapus awalan 'U' jika ada
        $user = User::find($userId);

        if ($user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'dob' => $request->dob,
                'address' => $request->address,
                'emergency_contact' => $request->emergencyContact,
                'avatar' => $request->avatar, // Ini akan menyimpan string Base64 foto
            ]);

            return response()->json(['status' => 'success', 'data' => $user]);
        }

        return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan'], 404);
    }
}
