<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\DescriptionEnhancementServiceInterface;

class DescriptionEnhancementService
{
    public function __construct(
        private DescriptionEnhancementServiceInterface $descriptionEnhancementService
    ) {}

    public function enhanceDescription(string $description, array $context = []): array
    {
        return $this->descriptionEnhancementService->enhanceDescription($description, $context);
    }
}

