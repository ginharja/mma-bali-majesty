<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah tamu membawa header 'x-api-key' yang cocok dengan rahasia kita
        $apiKey = $request->header('x-api-key');

        if ($apiKey !== env('API_SECRET_KEY')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Denied! What do you want?'
            ], 401);
        }

        return $next($request);
    }
}
