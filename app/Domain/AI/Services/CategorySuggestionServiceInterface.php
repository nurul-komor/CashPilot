<?php

namespace App\Domain\AI\Services;

interface CategorySuggestionServiceInterface
{
    /**
     * Suggest category and tags for a transaction
     *
     * @param string $description Transaction description or merchant name
     * @param int $userId User ID to learn from their historical patterns
     * @param string|null $amount Optional amount for better suggestions
     * @return array Contains 'category_id', 'category_name', 'tags' (array of tag names)
     */
    public function suggestCategoryAndTags(string $description, int $userId, ?string $amount = null): array;
}

