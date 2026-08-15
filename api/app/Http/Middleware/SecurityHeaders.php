<?php

namespace App\Http\Middleware;

use Closure;

class SecurityHeaders
{
    /**
     * Header keamanan untuk semua respons API.
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('X-XSS-Protection', '0');
        $response->headers->set('Cache-Control', 'no-store, max-age=0');

        return $response;
    }
}
