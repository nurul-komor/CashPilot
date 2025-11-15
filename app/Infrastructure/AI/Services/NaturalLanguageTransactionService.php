<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\NaturalLanguageTransactionServiceInterface;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;

class NaturalLanguageTransactionService implements NaturalLanguageTransactionServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private AccountRepositoryInterface $accountRepository,
        private CategoryRepositoryInterface $categoryRepository
    ) {}

    public function parseTransaction(string $input, int $userId): array
    {
        // Get user's accounts and categories for context
        $accounts = $this->accountRepository->findByUserId($userId);
        $categories = $this->categoryRepository->findByUserId($userId);

        $accountList = $accounts->map(fn($acc) => "{$acc->id}: {$acc->name} ({$acc->type})")->join(', ');
        $categoryList = $categories->map(fn($cat) => "{$cat->id}: {$cat->name} ({$cat->type})")->join(', ');

        $prompt = "Parse this natural language transaction input: \"{$input}\"

User's accounts: {$accountList}
User's categories: {$categoryList}

Extract and return JSON with:
{
  \"type\": \"income\", \"expense\", or \"transfer\",
  \"amount\": amount as number,
  \"currency\": \"BDT\", \"USD\", or \"EUR\",
  \"account_id\": account ID from the list (or null),
  \"category_id\": category ID if type is income/expense (or null),
  \"description\": extracted or generated description,
  \"transaction_date\": date in YYYY-MM-DD format (default to today if not specified),
  \"notes\": any additional context
}

Be smart about inferring the type, account, and category from the input.";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.4,
        ]);

        // Validate and set defaults
        $type = $response['type'] ?? 'expense';
        if (!in_array($type, ['income', 'expense', 'transfer'])) {
            $type = 'expense';
        }

        return [
            'type' => $type,
            'amount' => isset($response['amount']) ? (string) abs($response['amount']) : null,
            'currency' => $response['currency'] ?? 'BDT',
            'account_id' => isset($response['account_id']) && $response['account_id'] !== null
                ? (int) $response['account_id']
                : ($accounts->first()?->id ?? null),
            'category_id' => isset($response['category_id']) && $response['category_id'] !== null
                ? (int) $response['category_id']
                : null,
            'description' => $response['description'] ?? $input,
            'transaction_date' => $response['transaction_date'] ?? now()->format('Y-m-d'),
            'notes' => $response['notes'] ?? null,
        ];
    }
}

