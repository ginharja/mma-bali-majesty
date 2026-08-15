<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // === FUNGSI LOGIN ===
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        // Cek apakah user ada, dan apakah password cocok dengan Hash
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Email atau password salah.'], 401);
        }

        return response()->json(['status' => 'success', 'user' => $user]);
    }

    // === FUNGSI REGISTER ===
    public function register(Request $request)
    {
        // 1. Validasi hanya menerima @gmail.com
        if (!str_ends_with(strtolower($request->email), '@gmail.com')) {
            return response()->json(['status' => 'error', 'message' => 'Hanya email @gmail.com yang diizinkan.'], 400);
        }

        // 2. Cek email ganda
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['status' => 'error', 'message' => 'Email sudah terdaftar.'], 400);
        }

        // 3. Simpan User dengan Password yang di-Hash dinamis
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // ENKRIPSI DINAMIS
            'branch_id' => $request->branch_id,
            'role' => 'member',
            'status' => 'active'
        ]);

        // 4. Kirim Email Notifikasi
        $htmlBody = "<h3>Welcome to MAJESTY BALI, {$request->name}!</h3>
                     <p>Pendaftaran akun Anda berhasil. Berikut adalah detail login Anda:</p>
                     <p><strong>Email:</strong> {$request->email}<br>
                     <strong>Password:</strong> {$request->password}</p>
                     <p>Harap segera ganti password Anda setelah login.</p>";

        try {
            Mail::html($htmlBody, function ($msg) use ($request) {
                $msg->to($request->email)->subject('Pendaftaran MAJESTY BALI Berhasil');
            });
        } catch (\Exception $e) {
            // Abaikan error email jika SMTP bermasalah, tetap return success agar user terdaftar
        }

        return response()->json(['status' => 'success', 'user' => $user]);
    }

    // === FUNGSI FORGOT PASSWORD ===
    public function sendResetLink(Request $request)
    {
        if (!str_ends_with(strtolower($request->email), '@gmail.com')) {
            return response()->json(['status' => 'error', 'message' => 'Hanya email @gmail.com yang valid.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['status' => 'error', 'message' => 'Email tidak ditemukan.'], 404);

        // Buat token unik
        $token = Str::random(60);
        $user->remember_token = $token;
        $user->save();

        // Buat link reset (Arahkan kembali ke React dengan parameter)
        $resetLink = "http://localhost:5173/?reset_token={$token}&email={$request->email}";

        $htmlBody = "<h3>Reset Password MAJESTY BALI</h3>
                     <p>Halo {$user->name}, kami menerima permintaan reset password untuk akun Anda.</p>
                     <p>Klik link di bawah ini untuk membuat password baru:</p>
                     <a href='{$resetLink}' style='background:#CCFF00; color:#000; padding:10px 20px; text-decoration:none; font-weight:bold; border-radius:10px;'>RESET PASSWORD</a>";

        try {
            Mail::html($htmlBody, function ($msg) use ($request) {
                $msg->to($request->email)->subject('Reset Password MAJESTY BALI');
            });
            return response()->json(['status' => 'success', 'message' => 'Link reset telah dikirim ke email Anda.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengirim email. Periksa koneksi SMTP Anda.'], 500);
        }
    }

    // === FUNGSI RESET PASSWORD ===
    public function resetPassword(Request $request)
    {
        $user = User::where('email', $request->email)->where('remember_token', $request->token)->first();
        if (!$user) return response()->json(['status' => 'error', 'message' => 'Token tidak valid atau kedaluwarsa.'], 400);

        $user->password = Hash::make($request->password);
        $user->remember_token = null; // Hapus token setelah dipakai
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'Password berhasil diubah!']);
    }
}
