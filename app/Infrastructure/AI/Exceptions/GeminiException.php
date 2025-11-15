<?php

namespace App\Infrastructure\AI\Exceptions;

use Exception;

class GeminiException extends Exception
{
    public static function apiError(string $message, int $code = 500): self
    {
        return new self("Gemini API Error: {$message}", $code);
    }

    public static function invalidResponse(string $message = 'Invalid response from Gemini API'): self
    {
        return new self($message, 500);
    }

    public static function rateLimitExceeded(): self
    {
        return new self('Gemini API rate limit exceeded. Please try again later.', 429);
    }

    public static function invalidApiKey(): self
    {
        return new self('Invalid Gemini API key. Please check your configuration.', 401);
    }
}

