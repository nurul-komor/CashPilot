import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import AccountDocumentScanner from '@/Components/AccountDocumentScanner';
import { Sparkles } from 'lucide-react';

interface BudgetsCreateProps {
    categories: Category[];
}

export default function BudgetsCreate({ categories }: BudgetsCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        period_type: 'monthly',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        total_amount: '',
        currency: 'BDT',
        category_allocations: [] as Array<{ category_id: number; amount: string }>,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('budgets.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleCategoryAllocation = (categoryId: number, amount: string) => {
        const allocations = [...data.category_allocations];
        const index = allocations.findIndex(a => a.category_id === categoryId);

        if (index >= 0) {
            if (amount === '' || parseFloat(amount) === 0) {
                allocations.splice(index, 1);
            } else {
                allocations[index].amount = amount;
            }
        } else if (amount !== '' && parseFloat(amount) > 0) {
            allocations.push({ category_id: categoryId, amount });
        }

        setData('category_allocations', allocations);
    };

    const getCategoryAllocation = (categoryId: number) => {
        const allocation = data.category_allocations.find(a => a.category_id === categoryId);
        return allocation?.amount || '';
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
                        Create Budget
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Scanner</span>
                    </div>
                </div>
            }
        >
            <Head title="Create Budget" />

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
                            <p className="text-xs text-gray-600">Scan budget documents or spreadsheets to auto-fill budget information</p>
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
                                    placeholder="e.g., Monthly Budget 2025"
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
                                        value={data.month}
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

                            {categories.length > 0 && (
                                <div>
                                    <InputLabel value="Category Allocations (Optional)" />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Allocate specific amounts to categories. Leave empty to use total amount for all categories.
                                    </p>
                                    <div className="mt-4 space-y-3">
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex items-center gap-4">
                                                <label className="flex-1 text-sm font-medium text-gray-700">
                                                    {category.name}
                                                </label>
                                                <TextInput
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="w-32"
                                                    value={getCategoryAllocation(category.id)}
                                                    onChange={(e) => handleCategoryAllocation(category.id, e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.category_allocations} className="mt-2" />
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    Create Budget
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
