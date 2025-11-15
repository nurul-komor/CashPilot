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

        // Calculate summary
        $totalIncome = $this->transactionRepository->findByUserId($user->id, [
            'type' => 'income',
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d'),
        ])->sum('amount');

        $totalExpense = $this->transactionRepository->findByUserId($user->id, [
            'type' => 'expense',
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d'),
        ])->sum('amount');

        return Inertia::render('Dashboard', [
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'budgets' => $budgets,
            'goals' => $goals,
            'summary' => [
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'net_balance' => $totalIncome - $totalExpense,
                'savings_rate' => $totalIncome > 0 ? (($totalIncome - $totalExpense) / $totalIncome) * 100 : 0,
            ],
        ]);
    }
}

