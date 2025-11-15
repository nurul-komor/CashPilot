<?php

namespace App\Infrastructure\AI\Services;

use App\Domain\AI\Services\FinancialInsightServiceInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Infrastructure\AI\GeminiClient;
use Carbon\Carbon;

class FinancialInsightService implements FinancialInsightServiceInterface
{
    public function __construct(
        private GeminiClient $geminiClient,
        private TransactionRepositoryInterface $transactionRepository,
        private BudgetRepositoryInterface $budgetRepository,
        private GoalRepositoryInterface $goalRepository,
        private AccountRepositoryInterface $accountRepository
    ) {}

    public function generateInsights(int $userId, ?string $period = 'monthly'): array
    {
        $transactions = $this->getTransactionsForPeriod($userId, $period);
        $budgets = $this->budgetRepository->findByUserId($userId);
        $goals = $this->goalRepository->findByUserId($userId);
        $accounts = $this->accountRepository->findByUserId($userId);

        $summary = $this->calculateSummary($transactions);
        $spendingByCategory = $this->getSpendingByCategory($transactions);
        $budgetStatus = $this->getBudgetStatus($budgets, $transactions);

        $context = $this->buildFinancialContext($summary, $spendingByCategory, $budgetStatus, $goals, $accounts);

        $prompt = "Analyze this user's financial data and provide insights:

{$context}

Provide comprehensive insights in JSON format:
{
  \"spending_trends\": \"analysis of spending patterns\",
  \"top_categories\": [\"top spending categories with amounts\"],
  \"savings_opportunities\": [\"specific areas where user can save money\"],
  \"budget_recommendations\": [\"recommendations for budget adjustments\"],
  \"goal_progress\": \"analysis of financial goals progress\",
  \"alerts\": [\"important financial alerts or warnings\"],
  \"recommendations\": [\"actionable recommendations\"]
}";

        $response = $this->geminiClient->generateJson($prompt, [
            'temperature' => 0.6,
        ]);

        return [
            'period' => $period,
            'summary' => $summary,
            'spending_by_category' => $spendingByCategory,
            'insights' => $response,
        ];
    }

    public function getBudgetRecommendations(int $userId): array
    {
        $transactions = $this->getTransactionsForPeriod($userId, 'monthly');
        $spendingByCategory = $this->getSpendingByCategory($transactions);
        $existingBudgets = $this->budgetRepository->findByUserId($userId);

        $context = "User's monthly spending by category:\n";
        foreach ($spendingByCategory as $category => $amount) {
            $context .= "- {$category}: ৳{$amount}\n";
        }

        $prompt = "Based on the spending patterns, suggest monthly budget amounts for each category in JSON format:
{
  \"recommendations\": [
    {
      \"category_id\": category ID,
      \"category_name\": \"category name\",
      \"suggested_amount\": suggested monthly budget amount,
      \"reason\": \"explanation\"
    }
  ]
}";

        $response = $this->geminiClient->generateJson($prompt);

        return $response['recommendations'] ?? [];
    }

    public function generateSummary(int $userId, string $period = 'monthly'): array
    {
        $transactions = $this->getTransactionsForPeriod($userId, $period);
        $summary = $this->calculateSummary($transactions);

        $prompt = "Generate a financial summary for this period in JSON format:
{
  \"total_income\": total income amount,
  \"total_expenses\": total expenses amount,
  \"net_savings\": net savings (income - expenses),
  \"savings_rate\": savings rate as percentage,
  \"trend\": \"improving\", \"declining\", or \"stable\",
  \"summary_text\": \"human-readable summary paragraph\",
  \"key_highlights\": [\"key financial highlights\"]
}";

        $response = $this->geminiClient->generateJson($prompt);

        return array_merge($summary, [
            'summary_text' => $response['summary_text'] ?? '',
            'trend' => $response['trend'] ?? 'stable',
            'key_highlights' => $response['key_highlights'] ?? [],
        ]);
    }

    private function getTransactionsForPeriod(int $userId, string $period): \Illuminate\Database\Eloquent\Collection
    {
        $startDate = match($period) {
            'weekly' => now()->startOfWeek()->format('Y-m-d'),
            'yearly' => now()->startOfYear()->format('Y-m-d'),
            default => now()->startOfMonth()->format('Y-m-d'),
        };

        $endDate = match($period) {
            'weekly' => now()->endOfWeek()->format('Y-m-d'),
            'yearly' => now()->endOfYear()->format('Y-m-d'),
            default => now()->endOfMonth()->format('Y-m-d'),
        };

        return $this->transactionRepository->findByUserId($userId, [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }

    private function calculateSummary($transactions): array
    {
        $income = $transactions->where('type', 'income')->sum('amount');
        $expenses = $transactions->where('type', 'expense')->sum('amount');
        $net = $income - $expenses;
        $savingsRate = $income > 0 ? ($net / $income) * 100 : 0;

        return [
            'total_income' => (float) $income,
            'total_expenses' => (float) $expenses,
            'net_savings' => (float) $net,
            'savings_rate' => round($savingsRate, 2),
        ];
    }

    private function getSpendingByCategory($transactions): array
    {
        return $transactions->where('type', 'expense')
            ->groupBy('category_id')
            ->map(function ($group) {
                return $group->sum('amount');
            })
            ->mapWithKeys(function ($amount, $categoryId) use ($transactions) {
                $category = $transactions->firstWhere('category_id', $categoryId)?->category;
                $name = $category?->name ?? 'Uncategorized';
                return [$name => (float) $amount];
            })
            ->toArray();
    }

    private function getBudgetStatus($budgets, $transactions): array
    {
        $status = [];
        foreach ($budgets as $budget) {
            $spent = $transactions->where('category_id', $budget->category_id)
                ->where('type', 'expense')
                ->sum('amount');
            $status[] = [
                'category' => $budget->category?->name ?? 'Unknown',
                'budget' => (float) $budget->amount,
                'spent' => (float) $spent,
                'remaining' => (float) ($budget->amount - $spent),
                'percentage' => $budget->amount > 0 ? ($spent / $budget->amount) * 100 : 0,
            ];
        }
        return $status;
    }

    private function buildFinancialContext(array $summary, array $spendingByCategory, array $budgetStatus, $goals, $accounts): string
    {
        $context = "Financial Summary:\n";
        $context .= "- Total Income: ৳{$summary['total_income']}\n";
        $context .= "- Total Expenses: ৳{$summary['total_expenses']}\n";
        $context .= "- Net Savings: ৳{$summary['net_savings']}\n";
        $context .= "- Savings Rate: {$summary['savings_rate']}%\n\n";

        $context .= "Spending by Category:\n";
        foreach ($spendingByCategory as $category => $amount) {
            $context .= "- {$category}: ৳{$amount}\n";
        }

        if (!empty($budgetStatus)) {
            $context .= "\nBudget Status:\n";
            foreach ($budgetStatus as $status) {
                $context .= "- {$status['category']}: ৳{$status['spent']} / ৳{$status['budget']} ({$status['percentage']}%)\n";
            }
        }

        if ($goals->isNotEmpty()) {
            $context .= "\nFinancial Goals:\n";
            foreach ($goals as $goal) {
                $context .= "- {$goal->name}: ৳{$goal->current_amount} / ৳{$goal->target_amount}\n";
            }
        }

        return $context;
    }
}

