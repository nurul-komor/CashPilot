import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Account, Transaction, Budget, FinancialGoal, DashboardSummary } from '@/types';
import { Sparkles, Brain, ArrowLeftRight, TrendingUp, TrendingDown, DollarSign, Target, Wallet, Plus, ArrowUpRight, ArrowDownRight, ArrowLeftRight as ArrowLeftRightIcon, PiggyBank, Receipt } from 'lucide-react';

interface DashboardProps {
    accounts: Account[];
    recentTransactions: Transaction[];
    budgets: Budget[];
    goals: FinancialGoal[];
    summary: DashboardSummary;
}

export default function Dashboard({ accounts, recentTransactions, budgets, goals, summary }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold leading-tight text-gray-800 sm:text-xl">
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md w-fit">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-xs font-medium sm:text-sm">AI Powered</span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 sm:text-sm">Total Income</p>
                                        <p className="mt-2 text-xl font-bold text-green-600 sm:text-2xl">
                                            ৳{summary?.total_income?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">This Month</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 sm:text-sm">Total Expense</p>
                                        <p className="mt-2 text-xl font-bold text-red-600 sm:text-2xl">
                                            ৳{summary?.total_expense?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">This Month</p>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <TrendingDown className="h-6 w-6 text-red-600 sm:h-8 sm:w-8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 sm:text-sm">Net Balance</p>
                                        <p className={`mt-2 text-xl font-bold sm:text-2xl ${(summary?.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ৳{summary?.net_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">This Month</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${(summary?.net_balance || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <DollarSign className={`h-6 w-6 sm:h-8 sm:w-8 ${(summary?.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 sm:text-sm">Savings Amount</p>
                                        <p className={`mt-2 text-xl font-bold sm:text-2xl ${(summary?.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {(() => {
                                                const amount = summary?.net_balance ?? 0;
                                                const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
                                                return `৳${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                            })()}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">This Month</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${(summary?.net_balance || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <PiggyBank className={`h-6 w-6 sm:h-8 sm:w-8 ${(summary?.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Features Badge */}
                    <div className="mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-sm sm:mb-6">
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 sm:h-10 sm:w-10">
                                    <Brain className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">AI Assistant Active</h3>
                                    <p className="text-xs text-gray-600 leading-tight sm:leading-normal">Smart suggestions, receipt OCR, and financial insights are ready</p>
                                </div>
                                <Sparkles className="h-4 w-4 shrink-0 text-purple-500 animate-pulse sm:h-5 sm:w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow sm:mb-8">
                        <div className="p-4 sm:p-6">
                            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                                <Link
                                    href={route('transactions.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <Plus className="mb-1.5 h-6 w-6 text-green-600 sm:mb-2 sm:h-8 sm:w-8" />
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Add Transaction</span>
                                </Link>
                                <Link
                                    href={route('accounts.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <Plus className="mb-1.5 h-6 w-6 text-blue-600 sm:mb-2 sm:h-8 sm:w-8" />
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Add Account</span>
                                </Link>
                                <Link
                                    href="/accounts/transfer"
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <ArrowLeftRight className="mb-1.5 h-6 w-6 text-purple-600 sm:mb-2 sm:h-8 sm:w-8" />
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Transfer</span>
                                </Link>
                                <Link
                                    href={route('budgets.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <svg className="mb-1.5 h-6 w-6 text-orange-600 sm:mb-2 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Create Budget</span>
                                </Link>
                                <Link
                                    href={route('goals.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <svg className="mb-1.5 h-6 w-6 text-yellow-600 sm:mb-2 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Set Goal</span>
                                </Link>
                                <Link
                                    href={route('reports.index')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 active:bg-gray-100 sm:p-4"
                                >
                                    <svg className="mb-1.5 h-6 w-6 text-indigo-600 sm:mb-2 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight sm:text-sm sm:leading-normal">Reports</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Accounts Overview */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-5 w-5 text-blue-600" />
                                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Accounts</h3>
                                    </div>
                                    <Link
                                        href={route('accounts.index')}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 sm:text-sm"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                {accounts && accounts.length > 0 ? (
                                    <div className="space-y-3">
                                        {accounts.slice(0, 5).map((account) => (
                                            <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <div className="text-sm font-medium text-gray-900 truncate sm:text-base">{account.name}</div>
                                                    <div className="text-xs text-gray-500 sm:text-sm capitalize">{account.type}</div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-sm font-semibold text-gray-900 sm:text-base">
                                                        ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{account.currency}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center sm:py-8">
                                        <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 sm:text-base">No accounts yet</p>
                                        <Link
                                            href={route('accounts.create')}
                                            className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-800 sm:text-sm"
                                        >
                                            Create your first account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5 text-green-600" />
                                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Recent Transactions</h3>
                                    </div>
                                    <Link
                                        href={route('transactions.index')}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 sm:text-sm"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                {recentTransactions && recentTransactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentTransactions.map((transaction) => {
                                            const getTypeIcon = () => {
                                                switch (transaction.type) {
                                                    case 'income':
                                                        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
                                                    case 'expense':
                                                        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
                                                    case 'transfer':
                                                        return <ArrowLeftRightIcon className="h-4 w-4 text-blue-600" />;
                                                    default:
                                                        return null;
                                                }
                                            };
                                            return (
                                                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                                                        <div className="shrink-0">
                                                            {getTypeIcon()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate sm:text-base">
                                                                {transaction.description || 'No description'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 sm:text-sm">
                                                                {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-right shrink-0 text-sm font-semibold sm:text-base ${
                                                        transaction.type === 'income' ? 'text-green-600' :
                                                        transaction.type === 'expense' ? 'text-red-600' :
                                                        'text-blue-600'
                                                    }`}>
                                                        {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                                                        ৳{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center sm:py-8">
                                        <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 sm:text-base">No transactions yet</p>
                                        <Link
                                            href={route('transactions.create')}
                                            className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-800 sm:text-sm"
                                        >
                                            Add your first transaction
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Budgets & Goals */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-orange-600" />
                                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Budgets & Goals</h3>
                                </div>
                                <div className="space-y-4">
                                    {/* Active Budgets */}
                                    {budgets && budgets.length > 0 ? (
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Active Budgets</h4>
                                            <div className="space-y-2">
                                                {budgets.slice(0, 3).map((budget) => {
                                                    const firstCategory = budget.categories?.[0];
                                                    return (
                                                        <div key={budget.id} className="p-2 bg-orange-50 rounded-lg border border-orange-100">
                                                            <div className="text-xs font-medium text-gray-900 truncate">
                                                                {budget.name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-0.5">
                                                                ৳{parseFloat(budget.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}/{budget.period_type === 'monthly' ? 'month' : 'year'}
                                                            </div>
                                                            {firstCategory && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {firstCategory.category?.name || 'Uncategorized'}: ৳{parseFloat(firstCategory.allocated_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {budgets.length > 3 && (
                                                <Link
                                                    href={route('budgets.index')}
                                                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View {budgets.length - 3} more →
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center">
                                            <p className="text-xs text-gray-500">No budgets set</p>
                                            <Link
                                                href={route('budgets.create')}
                                                className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Create budget
                                            </Link>
                                        </div>
                                    )}

                                    {/* Financial Goals */}
                                    {goals && goals.length > 0 ? (
                                        <div className="pt-4 border-t border-gray-200">
                                            <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Goals</h4>
                                            <div className="space-y-2">
                                                {goals.slice(0, 3).map((goal) => {
                                                    const currentAmount = parseFloat(goal.current_amount);
                                                    const targetAmount = parseFloat(goal.target_amount);
                                                    const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
                                                    return (
                                                        <div key={goal.id} className="p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                                                            <div className="text-xs font-medium text-gray-900 truncate">
                                                                {goal.name}
                                                            </div>
                                                            <div className="mt-1.5">
                                                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                                    <span>৳{currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                                    <span>৳{targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                    <div
                                                                        className="bg-yellow-600 h-1.5 rounded-full transition-all"
                                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-0.5">{progress.toFixed(0)}%</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {goals.length > 3 && (
                                                <Link
                                                    href={route('goals.index')}
                                                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View {goals.length - 3} more →
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="pt-4 border-t border-gray-200 py-4 text-center">
                                            <p className="text-xs text-gray-500">No goals set</p>
                                            <Link
                                                href={route('goals.create')}
                                                className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Set a goal
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Links Section */}
                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow sm:mt-8">
                        <div className="p-4 sm:p-6">
                            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">All Features</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                                <Link
                                    href={route('accounts.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Accounts</span>
                                </Link>
                                <Link
                                    href={route('transactions.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-green-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Transactions</span>
                                </Link>
                                <Link
                                    href={route('budgets.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-orange-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Budgets</span>
                                </Link>
                                <Link
                                    href={route('goals.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-yellow-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Goals</span>
                                </Link>
                                <Link
                                    href={route('categories.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-purple-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Categories</span>
                                </Link>
                                <Link
                                    href={route('tags.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-pink-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Tags</span>
                                </Link>
                                <Link
                                    href={route('reports.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-indigo-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Reports</span>
                                </Link>
                                <Link
                                    href={route('settings.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-2.5 transition hover:bg-gray-50 active:bg-gray-100 sm:space-x-2 sm:p-3"
                                >
                                    <svg className="h-4 w-4 shrink-0 text-gray-600 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-700 sm:text-sm">Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
