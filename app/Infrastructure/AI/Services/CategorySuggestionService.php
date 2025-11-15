<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\CategorySuggestionServiceInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;

class CategorySuggestionService implements CategorySuggestionServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private CategoryRepositoryInterface $categoryRepository,
        private TagRepositoryInterface $tagRepository,
        private TransactionRepositoryInterface $transactionRepository
    ) {}

    public function suggestCategoryAndTags(string $description, int $userId, ?string $amount = null): array
    {
        // Get user's categories and tags
        $categories = $this->categoryRepository->findByUserId($userId);
        $tags = $this->tagRepository->findByUserId($userId);

        // Get user's transaction history for pattern learning
        $recentTransactions = $this->transactionRepository->findByUserId($userId, [
            'start_date' => now()->subDays(90)->format('Y-m-d'),
        ])->take(50);

        $categoryList = $categories->map(fn($cat) => "{$cat->id}: {$cat->name} ({$cat->type})")->join(', ');
        $tagList = $tags->map(fn($tag) => $tag->name)->join(', ');

        // Build pattern context from recent transactions
        $patternContext = $this->buildPatternContext($recentTransactions, $description);

        $prompt = "Based on this transaction description: \"{$description}\"
" . ($amount ? "Amount: {$amount}\n" : '') . "
User's available categories: {$categoryList}
User's available tags: {$tagList}

{$patternContext}

Suggest the most appropriate category and relevant tags. Respond in JSON format:
{
  \"category_id\": category ID from the list above (or null),
  \"category_name\": \"category name\",
  \"tags\": [\"tag names from the list above\"],
  \"confidence\": confidence score 0-1,
  \"reason\": \"brief explanation\"
}";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.5,
        ]);

        return [
            'category_id' => isset($response['category_id']) && $response['category_id'] !== null
                ? (int) $response['category_id']
                : null,
            'category_name' => $response['category_name'] ?? null,
            'tags' => $response['tags'] ?? [],
            'confidence' => $response['confidence'] ?? 0.5,
            'reason' => $response['reason'] ?? null,
        ];
    }

    private function buildPatternContext($transactions, string $description): string
    {
        if ($transactions->isEmpty()) {
            return '';
        }

        // Find similar transactions
        $similarTransactions = $transactions->filter(function ($transaction) use ($description) {
            $desc = strtolower($transaction->description ?? '');
            $input = strtolower($description);

            // Simple similarity check
            return similar_text($desc, $input) > 50 || str_contains($desc, $input) || str_contains($input, $desc);
        })->take(5);

        if ($similarTransactions->isEmpty()) {
            return '';
        }

        $examples = $similarTransactions->map(function ($t) {
            return "- Description: {$t->description}, Category: {$t->category?->name}, Amount: {$t->amount}";
        })->join("\n");

        return "Similar past transactions:\n{$examples}\n\nUse these patterns to suggest the category and tags.";
    }
}

