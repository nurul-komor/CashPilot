<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\AnomalyDetectionServiceInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;

class AnomalyDetectionService implements AnomalyDetectionServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private TransactionRepositoryInterface $transactionRepository
    ) {}

    public function detectAnomalies(int $userId, ?int $limit = 50): array
    {
        $transactions = $this->transactionRepository->findByUserId($userId, [
            'start_date' => now()->subDays(90)->format('Y-m-d'),
        ])->take($limit);

        if ($transactions->isEmpty()) {
            return [];
        }

        // Build transaction history for analysis
        $transactionData = $transactions->map(function ($t) {
            return [
                'id' => $t->id,
                'date' => $t->transaction_date->format('Y-m-d'),
                'type' => $t->type,
                'amount' => (float) $t->amount,
                'description' => $t->description ?? '',
                'category' => $t->category?->name ?? 'Uncategorized',
            ];
        })->toArray();

        $prompt = "Analyze these transactions and identify anomalies (unusual patterns, potential duplicates, suspicious activity):

" . json_encode($transactionData, JSON_PRETTY_PRINT) . "

Look for:
- Unusually large amounts compared to typical spending
- Potential duplicate transactions
- Transactions that deviate from normal patterns
- Suspicious or unexpected activity

Respond in JSON format:
{
  \"anomalies\": [
    {
      \"transaction_id\": transaction ID,
      \"type\": \"duplicate\", \"unusual_amount\", \"pattern_deviation\", or \"suspicious\",
      \"reason\": \"explanation\",
      \"severity\": \"low\", \"medium\", or \"high\",
      \"suggested_action\": \"what the user should do\"
    }
  ]
}";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.3, // Lower temperature for more accurate detection
        ]);

        return $response['anomalies'] ?? [];
    }

    public function checkTransaction(array $transactionData, int $userId): ?array
    {
        // Get user's transaction history for comparison
        $recentTransactions = $this->transactionRepository->findByUserId($userId, [
            'start_date' => now()->subDays(30)->format('Y-m-d'),
        ])->take(20);

        $avgAmount = $recentTransactions->where('type', $transactionData['type'] ?? 'expense')
            ->avg('amount') ?? 0;

        $context = "User's average {$transactionData['type']} amount: ৳{$avgAmount}\n";
        $context .= "Transaction to check: " . json_encode($transactionData, JSON_PRETTY_PRINT);

        $prompt = "Check if this transaction is anomalous compared to the user's typical patterns:

{$context}

Respond in JSON format (or null if normal):
{
  \"type\": \"duplicate\", \"unusual_amount\", \"pattern_deviation\", or \"suspicious\",
  \"reason\": \"explanation\",
  \"severity\": \"low\", \"medium\", or \"high\",
  \"suggested_action\": \"what the user should do\"
}

If the transaction appears normal, respond with null.";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.3,
        ]);

        if (empty($response) || (isset($response['type']) && $response['type'] === null)) {
            return null;
        }

        return $response;
    }
}

