<?php

namespace App\Presentation\Http\Controllers\Report;

use App\Application\AI\Services\FinancialInsightService;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function __construct(
        private TransactionRepositoryInterface $transactionRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private FinancialInsightService $financialInsightService
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $period = $request->query('period', 'monthly');

        // Cache key with user ID and period
        $cacheKey = "ai_report_{$userId}_{$period}";

        // Get or generate report data with 20-minute cache
        $reportData = Cache::remember($cacheKey, now()->addMinutes(20), function () use ($userId, $period) {
            return $this->generateReportData($userId, $period);
        });

        return Inertia::render('Reports/Index', [
            'reportData' => $reportData,
            'period' => $period,
        ]);
    }

    private function generateReportData(int $userId, string $period): array
    {
        // Get AI insights
        $insights = $this->financialInsightService->generateInsights($userId, $period);

        // Get transaction data for charts
        $transactions = $this->getTransactionsForPeriod($userId, $period);

        // Generate chart data
        $chartData = $this->generateChartData($transactions, $period);

        return [
            'insights' => $insights['insights'] ?? [],
            'summary' => $insights['summary'] ?? [],
            'spending_by_category' => $insights['spending_by_category'] ?? [],
            'charts' => $chartData,
            'generated_at' => now()->toIso8601String(),
        ];
    }

    private function getTransactionsForPeriod(int $userId, string $period)
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

    private function generateChartData($transactions, string $period): array
    {
        // Income vs Expenses over time
        $incomeExpenseData = $this->getIncomeExpenseOverTime($transactions, $period);

        // Spending by category (pie chart data)
        $categoryData = $this->getCategorySpendingData($transactions);

        // Monthly trend (if period is yearly)
        $trendData = $period === 'yearly'
            ? $this->getMonthlyTrendData($transactions)
            : $this->getDailyTrendData($transactions, $period);

        return [
            'income_expense' => $incomeExpenseData,
            'categories' => $categoryData,
            'trend' => $trendData,
        ];
    }

    private function getIncomeExpenseOverTime($transactions, string $period): array
    {
        $grouped = $transactions->groupBy(function ($transaction) use ($period) {
            return match($period) {
                'weekly' => Carbon::parse($transaction->transaction_date)->format('D'),
                'yearly' => Carbon::parse($transaction->transaction_date)->format('M'),
                default => Carbon::parse($transaction->transaction_date)->format('M d'),
            };
        });

        $data = [];
        foreach ($grouped as $period => $group) {
            $data[] = [
                'period' => $period,
                'income' => (float) $group->where('type', 'income')->sum('amount'),
                'expense' => (float) $group->where('type', 'expense')->sum('amount'),
            ];
        }

        return $data;
    }

    private function getCategorySpendingData($transactions): array
    {
        $expenses = $transactions->where('type', 'expense');
        $grouped = $expenses->groupBy(function ($transaction) {
            return $transaction->category_id ?? 'uncategorized';
        });

        $data = [];
        foreach ($grouped as $categoryId => $group) {
            $firstTransaction = $group->first();
            $category = $firstTransaction?->category;

            $data[] = [
                'name' => $category?->name ?? 'Uncategorized',
                'value' => (float) $group->sum('amount'),
            ];
        }

        // Sort by value descending
        usort($data, fn($a, $b) => $b['value'] <=> $a['value']);

        return array_slice($data, 0, 10); // Top 10 categories
    }

    private function getMonthlyTrendData($transactions): array
    {
        $grouped = $transactions->groupBy(function ($transaction) {
            return Carbon::parse($transaction->transaction_date)->format('M');
        });

        $data = [];
        foreach ($grouped as $month => $group) {
            $data[] = [
                'month' => $month,
                'income' => (float) $group->where('type', 'income')->sum('amount'),
                'expense' => (float) $group->where('type', 'expense')->sum('amount'),
            ];
        }

        return $data;
    }

    private function getDailyTrendData($transactions, string $period): array
    {
        $grouped = $transactions->groupBy(function ($transaction) {
            return Carbon::parse($transaction->transaction_date)->format('M d');
        });

        $data = [];
        foreach ($grouped as $date => $group) {
            $data[] = [
                'date' => $date,
                'income' => (float) $group->where('type', 'income')->sum('amount'),
                'expense' => (float) $group->where('type', 'expense')->sum('amount'),
            ];
        }

        return $data;
    }
}

