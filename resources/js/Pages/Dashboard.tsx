import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Account, Transaction, Budget, FinancialGoal, DashboardSummary } from '@/types';
import { Sparkles, Brain } from 'lucide-react';

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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Powered</span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Total Income (This Month)</div>
                                <div className="mt-2 text-2xl font-semibold text-green-600">
                                    ৳{summary?.total_income?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Total Expense (This Month)</div>
                                <div className="mt-2 text-2xl font-semibold text-red-600">
                                    ৳{summary?.total_expense?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Net Balance</div>
                                <div className={`mt-2 text-2xl font-semibold ${(summary?.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ৳{summary?.net_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Savings Rate</div>
                                <div className="mt-2 text-2xl font-semibold text-blue-600">
                                    {summary?.savings_rate?.toFixed(1) || '0.0'}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Features Badge */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-sm">
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900">AI Assistant Active</h3>
                                    <p className="text-xs text-gray-600">Smart suggestions, receipt OCR, and financial insights are ready</p>
                                </div>
                                <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                <Link
                                    href={route('transactions.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Add Transaction</span>
                                </Link>
                                <Link
                                    href={route('accounts.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Add Account</span>
                                </Link>
                                <Link
                                    href={route('accounts.transfer')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Transfer</span>
                                </Link>
                                <Link
                                    href={route('budgets.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Create Budget</span>
                                </Link>
                                <Link
                                    href={route('goals.create')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Set Goal</span>
                                </Link>
                                <Link
                                    href={route('reports.index')}
                                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                                >
                                    <svg className="mb-2 h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Reports</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Accounts Overview */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>
                                    <Link
                                        href={route('accounts.index')}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                {accounts && accounts.length > 0 ? (
                                    <div className="space-y-3">
                                        {accounts.slice(0, 5).map((account) => (
                                            <div key={account.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                                                <div>
                                                    <div className="font-medium text-gray-900">{account.name}</div>
                                                    <div className="text-sm text-gray-500">{account.type}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">
                                                        ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{account.currency}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-gray-500">No accounts yet</p>
                                        <Link
                                            href={route('accounts.create')}
                                            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Create your first account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                                    <Link
                                        href={route('transactions.index')}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                {recentTransactions && recentTransactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentTransactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">
                                                        {transaction.description || 'No description'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(transaction.transaction_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className={`text-right font-semibold ${
                                                    transaction.type === 'income' ? 'text-green-600' :
                                                    transaction.type === 'expense' ? 'text-red-600' :
                                                    'text-blue-600'
                                                }`}>
                                                    {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                                                    ৳{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-gray-500">No transactions yet</p>
                                        <Link
                                            href={route('transactions.create')}
                                            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Add your first transaction
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Important Links Section */}
                    <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">All Features</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                <Link
                                    href={route('accounts.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Accounts</span>
                                </Link>
                                <Link
                                    href={route('transactions.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Transactions</span>
                                </Link>
                                <Link
                                    href={route('budgets.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Budgets</span>
                                </Link>
                                <Link
                                    href={route('goals.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Goals</span>
                                </Link>
                                <Link
                                    href={route('categories.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Categories</span>
                                </Link>
                                <Link
                                    href={route('tags.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Tags</span>
                                </Link>
                                <Link
                                    href={route('reports.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Reports</span>
                                </Link>
                                <Link
                                    href={route('settings.index')}
                                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
