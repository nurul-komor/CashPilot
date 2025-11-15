import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Budget, Category } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import AccountDocumentScanner from '@/Components/AccountDocumentScanner';
import { Sparkles } from 'lucide-react';

interface BudgetsEditProps {
    budget: Budget;
    categories: Category[];
}

export default function BudgetsEdit({ budget, categories }: BudgetsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: budget.name,
        period_type: budget.period_type,
        year: budget.year,
        month: budget.month || null,
        total_amount: budget.total_amount,
        currency: budget.currency,
        is_active: budget.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('budgets.update', budget.id));
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Budget
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Scanner</span>
                    </div>
                </div>
            }
        >
            <Head title="Edit Budget" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('budgets.index')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Budgets
                        </Link>
                    </div>

                    {/* AI Document Scanner */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm sm:rounded-lg border border-purple-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-gray-900">AI Document Scanner</h3>
                            </div>
                            <p className="text-xs text-gray-600">Scan budget documents to update budget information</p>
                        </div>
                        <div className="p-6">
                            <AccountDocumentScanner
                                onDataExtracted={(extractedData) => {
                                    if (extractedData.name) setData('name', extractedData.name);
                                    if (extractedData.balance) setData('total_amount', extractedData.balance);
                                    if (extractedData.currency) setData('currency', extractedData.currency);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Budget Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="period_type" value="Period Type *" />
                                <select
                                    id="period_type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.period_type}
                                    onChange={(e) => setData('period_type', e.target.value)}
                                    required
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                <InputError message={errors.period_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="year" value="Year *" />
                                <TextInput
                                    id="year"
                                    type="number"
                                    min="2020"
                                    max="2100"
                                    className="mt-1 block w-full"
                                    value={data.year}
                                    onChange={(e) => setData('year', parseInt(e.target.value))}
                                    required
                                />
                                <InputError message={errors.year} className="mt-2" />
                            </div>

                            {data.period_type === 'monthly' && (
                                <div>
                                    <InputLabel htmlFor="month" value="Month *" />
                                    <select
                                        id="month"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.month || ''}
                                        onChange={(e) => setData('month', parseInt(e.target.value))}
                                        required
                                    >
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.month} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="total_amount" value="Total Budget Amount *" />
                                <TextInput
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="mt-1 block w-full"
                                    value={data.total_amount}
                                    onChange={(e) => setData('total_amount', e.target.value)}
                                    required
                                />
                                <InputError message={errors.total_amount} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="currency" value="Currency" />
                                <select
                                    id="currency"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                >
                                    <option value="BDT">BDT (৳)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                                <InputError message={errors.currency} className="mt-2" />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    Update Budget
                                </PrimaryButton>
                                <Link href={route('budgets.index')}>
                                    <SecondaryButton type="button">
                                        Cancel
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
