<?php

namespace App\Domain\AI\Services;

interface DescriptionEnhancementServiceInterface
{
    /**
     * Enhance transaction description
     *
     * @param string $description Current description
     * @param array $context Additional context (amount, date, merchant, etc.)
     * @return array Enhanced description and notes
     */
    public function enhanceDescription(string $description, array $context = []): array;
}

