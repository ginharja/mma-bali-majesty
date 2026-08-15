<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://learnmmabalimajesty.com',
        'capacitor://localhost',
        'https://localhost',
        'http://localhost',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['x-api-key', 'content-type', 'accept', 'authorization'],

    'exposed_headers' => ['x-ratelimit-limit', 'x-ratelimit-remaining'],

    'max_age' => 3600,

    'supports_credentials' => false,

];
