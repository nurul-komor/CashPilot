import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Account, Category, Tag } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import SearchableSelect from '@/Components/SearchableSelect';
import { Sparkles } from 'lucide-react';
import ReceiptScanner from '@/Components/ReceiptScanner';
import axios from 'axios';
import { useState } from 'react';

interface TransactionsCreateProps {
    accounts: Account[];
    categories: Category[];
    tags: Tag[];
}

export default function TransactionsCreate({ accounts, categories: initialCategories, tags }: TransactionsCreateProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const { data, setData, post, processing, errors, reset } = useForm({
        account_id: '',
        type: 'expense',
        amount: '',
        currency: 'BDT',
        category_id: '',
        description: '',
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0],
        tag_ids: [] as number[],
        is_recurring: false,
        recurring_frequency: '',
        receipt: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('transactions.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const transactionTypes = [
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
        { value: 'savings', label: 'Savings' },
    ];

    const recurringFrequencies = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const filteredCategories = categories.filter(cat => cat.type === data.type);

    const handleTagToggle = (tagId: number) => {
        setData('tag_ids', data.tag_ids.includes(tagId)
            ? data.tag_ids.filter(id => id !== tagId)
            : [...data.tag_ids, tagId]
        );
    };

    const handleCreateCategory = async (name: string): Promise<Category> => {
        // Check if category already exists (case-insensitive)
        const existingCategory = categories.find(
            cat => cat.name.toLowerCase().trim() === name.toLowerCase().trim() && cat.type === data.type
        );

        if (existingCategory) {
            // Return existing category instead of creating a new one
            return existingCategory;
        }

        const response = await axios.post(route('categories.store'), {
            name,
            type: data.type,
        });

        const newCategory = response.data;
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Transaction
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Enabled</span>
                    </div>
                </div>
            }
        >
            <Head title="Create Transaction" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('transactions.index')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Transactions
                        </Link>
                    </div>

                    {/* AI Receipt Scanner */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm sm:rounded-lg border border-purple-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-gray-900">AI Receipt Scanner</h3>
                            </div>
                            <p className="text-xs text-gray-600">Scan or upload a receipt to auto-fill transaction details</p>
                        </div>
                        <div className="p-6">
                            <ReceiptScanner
                                onDataExtracted={(extractedData) => {
                                    if (extractedData.merchant) setData('description', extractedData.merchant);
                                    if (extractedData.amount) setData('amount', extractedData.amount);
                                    if (extractedData.currency) setData('currency', extractedData.currency);
                                    if (extractedData.transaction_date) setData('transaction_date', extractedData.transaction_date);
                                    if (extractedData.category_id) setData('category_id', extractedData.category_id.toString());
                                    if (extractedData.type) setData('type', extractedData.type);
                                    if (extractedData.notes) setData('notes', extractedData.notes);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="type" value="Transaction Type *" />
                                <select
                                    id="type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as 'income' | 'expense' | 'savings')}
                                    required
                                >
                                    {transactionTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="account_id" value="Account *" />
                                <select
                                    id="account_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.account_id}
                                    onChange={(e) => setData('account_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({account.type}) - ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.account_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="amount" value="Amount *" />
                                <TextInput
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="mt-1 block w-full"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError message={errors.amount} className="mt-2" />
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
                                <SearchableSelect
                                    options={filteredCategories}
                                    value={data.category_id || null}
                                    onChange={(value) => setData('category_id', value?.toString() || '')}
                                    placeholder="Search or create a category..."
                                    label="Category"
                                    error={errors.category_id}
                                    onCreateNew={handleCreateCategory}
                                    createLabel="Create category"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <TextInput
                                    id="description"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="transaction_date" value="Transaction Date *" />
                                <TextInput
                                    id="transaction_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.transaction_date} className="mt-2" />
                            </div>

                            {tags.length > 0 && (
                                <div>
                                    <InputLabel value="Tags" />
                                    <div className="mt-2 space-y-2">
                                        {tags.map((tag) => (
                                            <label key={tag.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={data.tag_ids.includes(tag.id)}
                                                    onChange={() => handleTagToggle(tag.id)}
                                                />
                                                <span className="text-sm text-gray-700">{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.tag_ids} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="notes" value="Notes" />
                                <textarea
                                    id="notes"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={data.is_recurring}
                                        onChange={(e) => setData('is_recurring', e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-700">Recurring Transaction</span>
                                </label>
                            </div>

                            {data.is_recurring && (
                                <div>
                                    <InputLabel htmlFor="recurring_frequency" value="Recurring Frequency" />
                                    <select
                                        id="recurring_frequency"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.recurring_frequency}
                                        onChange={(e) => setData('recurring_frequency', e.target.value)}
                                    >
                                        <option value="">Select frequency</option>
                                        {recurringFrequencies.map((freq) => (
                                            <option key={freq.value} value={freq.value}>
                                                {freq.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.recurring_frequency} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="receipt" value="Receipt (Image)" />
                                <input
                                    id="receipt"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('receipt', e.target.files?.[0] || null)}
                                />
                                <InputError message={errors.receipt} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    Create Transaction
                                </PrimaryButton>
                                <Link href={route('transactions.index')}>
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
