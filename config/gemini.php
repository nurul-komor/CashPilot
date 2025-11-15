<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Google Gemini API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Google Gemini AI API integration.
    |
    */

    'api_key' => env('GEMINI_API_KEY', ''),

    'api_version' => env('GEMINI_API_VERSION', 'v1beta'),

    'model' => env('GEMINI_MODEL', 'gemini-2.0-flash'),

    'vision_model' => env('GEMINI_VISION_MODEL', 'gemini-2.0-flash'),

    'temperature' => env('GEMINI_TEMPERATURE', 0.7),

    'max_tokens' => env('GEMINI_MAX_TOKENS', 2048),

    'timeout' => env('GEMINI_TIMEOUT', 30),

    'cache_enabled' => env('GEMINI_CACHE_ENABLED', true),

    'cache_ttl' => env('GEMINI_CACHE_TTL', 3600), // 1 hour in seconds
];

