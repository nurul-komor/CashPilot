<?php

namespace App\Infrastructure\AI;

use App\Infrastructure\AI\Exceptions\GeminiException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    private string $apiKey;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    private string $apiVersion = 'v1beta';

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');
        $this->apiVersion = config('gemini.api_version', 'v1beta');
        $this->baseUrl = "https://generativelanguage.googleapis.com/{$this->apiVersion}";

        if (empty($this->apiKey)) {
            throw GeminiException::invalidApiKey();
        }
    }

    /**
     * List available models from Gemini API
     */
    public function listAvailableModels(): array
    {
        try {
            $response = Http::timeout(config('gemini.timeout', 30))
                ->get("{$this->baseUrl}/models?key={$this->apiKey}");

            if (!$response->successful()) {
                throw GeminiException::apiError($response->body(), $response->status());
            }

            $data = $response->json();
            return $data['models'] ?? [];
        } catch (\Exception $e) {
            Log::error('Failed to list Gemini models', ['error' => $e->getMessage()]);
            throw GeminiException::apiError($e->getMessage());
        }
    }

    public function generateText(string $prompt, array $options = []): string
    {
        $cacheKey = $this->getCacheKey('text', $prompt, $options);

        if (config('gemini.cache_enabled')) {
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                return $cached;
            }
        }

        try {
            $model = $options['model'] ?? config('gemini.model', 'gemini-2.0-flash');
            // Remove 'models/' prefix if present in config
            $model = str_replace('models/', '', $model);
            $temperature = $options['temperature'] ?? config('gemini.temperature', 0.7);
            $maxTokens = $options['max_tokens'] ?? config('gemini.max_tokens', 2048);

            // Build the correct API URL
            $url = "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}";

            $response = Http::timeout(config('gemini.timeout', 30))
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => $temperature,
                        'maxOutputTokens' => $maxTokens,
                    ],
                ]);

            if (!$response->successful()) {
                if ($response->status() === 429) {
                    throw GeminiException::rateLimitExceeded();
                }
                throw GeminiException::apiError($response->body(), $response->status());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            if (empty($text)) {
                throw GeminiException::invalidResponse('Empty response from Gemini API');
            }

            if (config('gemini.cache_enabled')) {
                Cache::put($cacheKey, $text, config('gemini.cache_ttl', 3600));
            }

            return $text;
        } catch (GeminiException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Gemini API error', [
                'error' => $e->getMessage(),
                'prompt' => substr($prompt, 0, 100),
            ]);

            if (str_contains($e->getMessage(), 'rate limit') || str_contains($e->getMessage(), '429')) {
                throw GeminiException::rateLimitExceeded();
            }

            throw GeminiException::apiError($e->getMessage());
        }
    }

    public function generateTextWithContext(string $prompt, array $context, array $options = []): string
    {
        $fullPrompt = $this->buildContextualPrompt($prompt, $context);
        return $this->generateText($fullPrompt, $options);
    }

    public function analyzeImage(string $imagePath, string $prompt, array $options = []): string
    {
        $cacheKey = $this->getCacheKey('vision', $imagePath . $prompt, $options);

        if (config('gemini.cache_enabled')) {
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                return $cached;
            }
        }

        try {
            if (!file_exists($imagePath)) {
                throw new \Exception("Image file not found: {$imagePath}");
            }

            $imageData = base64_encode(file_get_contents($imagePath));
            $mimeType = mime_content_type($imagePath);
            // Use a model that supports vision
            $model = $options['model'] ?? config('gemini.vision_model', 'gemini-2.0-flash');
            // Remove 'models/' prefix if present in config
            $model = str_replace('models/', '', $model);

            // Build the correct API URL
            $url = "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}";

            $response = Http::timeout(config('gemini.timeout', 30))
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $imageData,
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => $options['temperature'] ?? config('gemini.temperature', 0.7),
                        'maxOutputTokens' => $options['max_tokens'] ?? config('gemini.max_tokens', 2048),
                    ],
                ]);

            if (!$response->successful()) {
                if ($response->status() === 429) {
                    throw GeminiException::rateLimitExceeded();
                }
                throw GeminiException::apiError($response->body(), $response->status());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            if (empty($text)) {
                throw GeminiException::invalidResponse('Empty response from Gemini Vision API');
            }

            if (config('gemini.cache_enabled')) {
                Cache::put($cacheKey, $text, config('gemini.cache_ttl', 3600));
            }

            return $text;
        } catch (GeminiException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Gemini Vision API error', [
                'error' => $e->getMessage(),
                'image_path' => $imagePath,
            ]);

            if (str_contains($e->getMessage(), 'rate limit') || str_contains($e->getMessage(), '429')) {
                throw GeminiException::rateLimitExceeded();
            }

            throw GeminiException::apiError($e->getMessage());
        }
    }

    public function generateJson(string $prompt, array $options = []): array
    {
        $jsonPrompt = $prompt . "\n\nPlease respond with valid JSON only, no additional text.";
        $response = $this->generateText($jsonPrompt, $options);

        // Try to extract JSON from response
        $json = $this->extractJson($response);

        if ($json === null) {
            throw GeminiException::invalidResponse('Failed to parse JSON response from Gemini');
        }

        return $json;
    }

    private function buildContextualPrompt(string $prompt, array $context): string
    {
        $contextString = '';
        foreach ($context as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value, JSON_PRETTY_PRINT);
            }
            $contextString .= "{$key}: {$value}\n";
        }

        return "Context:\n{$contextString}\n\nPrompt: {$prompt}";
    }

    private function extractJson(string $text): ?array
    {
        // Try to find JSON in the response
        if (preg_match('/\{.*\}/s', $text, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            }
        }

        // Try to parse entire response as JSON
        $json = json_decode($text, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $json;
        }

        return null;
    }

    private function getCacheKey(string $type, string $content, array $options): string
    {
        return 'gemini:' . $type . ':' . md5($content . serialize($options));
    }
}

