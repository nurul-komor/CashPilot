<?php

namespace App\Application\AI\Services;

use App\Domain\AI\Services\CategorySuggestionServiceInterface;

class CategorySuggestionService
{
    public function __construct(
        private CategorySuggestionServiceInterface $categorySuggestionService
    ) {}

    public function suggestCategoryAndTags(string $description, int $userId, ?string $amount = null): array
    {
        return $this->categorySuggestionService->suggestCategoryAndTags($description, $userId, $amount);
    }
}

