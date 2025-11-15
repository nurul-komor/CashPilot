<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\DescriptionEnhancementServiceInterface;
use App\Infrastructure\AI\GeminiClient;

class DescriptionEnhancementService implements DescriptionEnhancementServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient
    ) {}

    public function enhanceDescription(string $description, array $context = []): array
    {
        $contextText = '';
        if (!empty($context)) {
            $contextText = "Additional Context:\n";
            foreach ($context as $key => $value) {
                if (is_scalar($value)) {
                    $contextText .= "- {$key}: {$value}\n";
                }
            }
        }

        $prompt = "Enhance and improve this transaction description: \"{$description}\"

{$contextText}

Make it more descriptive, clear, and standardized. If there's a merchant name, standardize it. Add context if helpful.

Respond in JSON format:
{
  \"enhanced_description\": \"improved description\",
  \"notes\": \"optional helpful notes about the transaction\",
  \"merchant\": \"extracted or standardized merchant name if applicable\"
}";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.5,
        ]);

        return [
            'enhanced_description' => $response['enhanced_description'] ?? $description,
            'notes' => $response['notes'] ?? null,
            'merchant' => $response['merchant'] ?? null,
        ];
    }
}

