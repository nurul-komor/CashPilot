<?php

namespace App\Presentation\Http\Controllers;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository,
        private TransactionRepositoryInterface $transactionRepository,
        private BudgetRepositoryInterface $budgetRepository,
        private GoalRepositoryInterface $goalRepository
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $accounts = $this->accountRepository->findByUserId($user->id);
        $recentTransactions = $this->transactionRepository->findByUserId($user->id, [
            'start_date' => now()->subDays(30)->format('Y-m-d'),
        ])->take(10);

        $budgets = $this->budgetRepository->findByUserId($user->id);
        $goals = $this->goalRepository->findByUserId($user->id);

        // Calculate summary - include income, savings, and general as positive transactions
        $startDate = now()->startOfMonth()->format('Y-m-d');
        $endDate = now()->endOfMonth()->format('Y-m-d');

        $allTransactions = $this->transactionRepository->findByUserId($user->id, [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $totalIncome = (float) $allTransactions->whereIn('type', ['income', 'savings', 'general'])->sum('amount');
        $totalExpense = (float) $allTransactions->where('type', 'expense')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        // Ensure netBalance is valid
        if (!is_numeric($netBalance) || is_nan($netBalance) || is_infinite($netBalance)) {
            $netBalance = 0;
        }

        // Calculate savings rate: (Net Savings / Total Income) * 100
        $savingsRate = $totalIncome > 0 ? ($netBalance / $totalIncome) * 100 : 0;

        // Ensure savings rate is valid
        if (!is_numeric($savingsRate) || is_nan($savingsRate) || is_infinite($savingsRate)) {
            $savingsRate = 0;
        }

        return Inertia::render('Dashboard', [
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'budgets' => $budgets,
            'goals' => $goals,
            'summary' => [
                'total_income' => (float) $totalIncome,
                'total_expense' => (float) $totalExpense,
                'net_balance' => (float) $netBalance,
                'savings_rate' => round($savingsRate, 2),
            ],
        ]);
    }
}

