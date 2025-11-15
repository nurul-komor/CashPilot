<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\ChatAssistantServiceInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;

class ChatAssistantService implements ChatAssistantServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private TransactionRepositoryInterface $transactionRepository,
        private AccountRepositoryInterface $accountRepository,
        private BudgetRepositoryInterface $budgetRepository,
        private GoalRepositoryInterface $goalRepository
    ) {}

    public function chat(string $message, int $userId, ?array $conversationHistory = null): array
    {
        // Get user's financial context
        $context = $this->buildUserContext($userId);

        // Build conversation history
        $historyText = '';
        if ($conversationHistory && !empty($conversationHistory)) {
            $historyText = "Conversation History:\n";
            foreach (array_slice($conversationHistory, -5) as $entry) {
                $historyText .= "User: {$entry['user']}\n";
                $historyText .= "Assistant: {$entry['assistant']}\n\n";
            }
        }

        $prompt = "You are a helpful financial assistant for FinGenie, an AI-powered personal finance management app.

User's Financial Context:
{$context}

{$historyText}

User's question: {$message}

Provide a helpful, accurate response based on the user's financial data. Be concise but informative. If the question cannot be answered with the available data, say so politely.

Respond in JSON format:
{
  \"message\": \"your response\",
  \"suggestions\": [\"optional actionable suggestions\"],
  \"data_points\": [\"any relevant data points mentioned\"]
}";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.7,
        ]);

        return [
            'message' => $response['message'] ?? 'I apologize, but I could not generate a response.',
            'suggestions' => $response['suggestions'] ?? [],
            'data_points' => $response['data_points'] ?? [],
        ];
    }

    private function buildUserContext(int $userId): string
    {
        $accounts = $this->accountRepository->findByUserId($userId);
        $recentTransactions = $this->transactionRepository->findByUserId($userId, [
            'start_date' => now()->subDays(30)->format('Y-m-d'),
        ])->take(20);
        $budgets = $this->budgetRepository->findByUserId($userId);
        $goals = $this->goalRepository->findByUserId($userId);

        $context = "Accounts:\n";
        foreach ($accounts as $account) {
            $context .= "- {$account->name} ({$account->type}): ৳{$account->balance}\n";
        }

        $income = $recentTransactions->where('type', 'income')->sum('amount');
        $expenses = $recentTransactions->where('type', 'expense')->sum('amount');

        $context .= "\nRecent Activity (Last 30 days):\n";
        $context .= "- Total Income: ৳{$income}\n";
        $context .= "- Total Expenses: ৳{$expenses}\n";
        $context .= "- Net: ৳" . ($income - $expenses) . "\n";

        if ($budgets->isNotEmpty()) {
            $context .= "\nActive Budgets:\n";
            foreach ($budgets->take(5) as $budget) {
                $context .= "- {$budget->category?->name}: ৳{$budget->amount}/month\n";
            }
        }

        if ($goals->isNotEmpty()) {
            $context .= "\nFinancial Goals:\n";
            foreach ($goals->take(5) as $goal) {
                $context .= "- {$goal->name}: ৳{$goal->current_amount} / ৳{$goal->target_amount}\n";
            }
        }

        return $context;
    }
}

