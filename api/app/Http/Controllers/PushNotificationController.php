<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use  Illuminate\Support\Facades\DB;

class PushNotificationController extends Controller
{
    public function index($id)
{
    // Bersihkan ID dari prefix 'U' jika ada
    $cleanId = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);

    // Ambil data notifikasi dari table (pastikan table 'notifications' sudah ada)
    // Jika belum ada table-nya, return array kosong [] agar React tidak crash
    return response()->json([]);
}

public function markAsRead($id)
{
    // Logika tandai dibaca
    return response()->json(['status' => 'success']);
}

    // 1. Simpan Token dari HP
    public function saveToken(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'fcm_token' => 'required|string'
        ]);

        $cleanId = (int) filter_var($request->user_id, FILTER_SANITIZE_NUMBER_INT);
        $user = User::find($cleanId);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $user->fcm_token = $request->fcm_token;
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'FCM Token saved successfully']);
    }

    // 2. Fungsi Utama Tembak Notifikasi (FCM HTTP v1)
    public function sendPush(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'nullable|string'
        ]);

        $cleanId = (int) filter_var($request->user_id, FILTER_SANITIZE_NUMBER_INT);
        $user = User::find($cleanId);

        if (!$user || empty($user->fcm_token)) {
            return response()->json(['status' => 'error', 'message' => 'User has no FCM Token'], 400);
        }

        // A. Dapatkan Access Token OAuth 2.0
        $accessToken = $this->getGoogleAccessToken();
        if (!$accessToken) {
            return response()->json(['status' => 'error', 'message' => 'Gagal generate Google Access Token'], 500);
        }

        // B. Ambil Project ID dari file JSON
        $credentialsPath = storage_path('app/firebase-credentials.json');
        $credentials = json_decode(file_get_contents($credentialsPath), true);
        $projectId = $credentials['project_id'];

        // C. Siapkan Payload FCM v1
        $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";

        $payload = [
            "message" => [
                "token" => $user->fcm_token,
                "notification" => [
                    "title" => $request->title,
                    "body" => $request->message
                ],
                "data" => [
                    "type" => $request->type ?? 'general'
                ],
                "android" => [
                    "notification" => [
                        "color" => "#CCFF00",
                        "sound" => "default"
                    ]
                ]
            ]
        ];

        // D. Tembak ke Google
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Content-Type' => 'application/json',
        ])->post($url, $payload);

        if ($response->successful()) {
            return response()->json(['status' => 'success', 'message' => 'Notification sent!']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Firebase rejected', 'details' => $response->json()], 500);
        }
    }

    // ---------------------------------------------------------------------
    // FUNGSI RAHASIA: Generate OAuth 2.0 Token Manual tanpa Composer Package
    // ---------------------------------------------------------------------
    private function getGoogleAccessToken()
    {
        $credentialsPath = storage_path('app/firebase-credentials.json');

        if (!file_exists($credentialsPath)) {
            Log::error('Firebase credentials file missing at storage/app/firebase-credentials.json');
            return null;
        }

        $credentials = json_decode(file_get_contents($credentialsPath), true);

        $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
        $now = time();

        $claim = json_encode([
            'iss' => $credentials['client_email'],
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlClaim = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($claim));

        $signatureInput = $base64UrlHeader . '.' . $base64UrlClaim;

        // Tanda tangani dengan Private Key dari JSON
        $privateKey = $credentials['private_key'];
        openssl_sign($signatureInput, $signature, $privateKey, 'sha256WithRSAEncryption');
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        $jwt = $signatureInput . '.' . $base64UrlSignature;

        // Tukar JWT dengan Access Token
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error('Gagal menukar JWT: ' . $response->body());
        return null;
    }
}
