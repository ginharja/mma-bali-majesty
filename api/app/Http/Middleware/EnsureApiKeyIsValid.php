<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureApiKeyIsValid
{
    public function handle(Request $request, Closure $next)
    {
        // 🟢 1. TAMBAHKAN INI: Loloskan pengecekan awal (Preflight CORS) dari Browser
        if ($request->isMethod('OPTIONS')) {
            return $next($request);
        }

        // 2. Kunci rahasia dari .env
        $validKey = env('API_SECRET_KEY'); // WAJIB diisi di .env — jangan hardcode secret di source

        // 3. Pengecekan Kunci Utama
        if ($request->header('x-api-key') !== $validKey) {
            return response()->json(['message' => 'Access Denied: Invalid API Key'], 403);
        }

        return $next($request);
    }
}
