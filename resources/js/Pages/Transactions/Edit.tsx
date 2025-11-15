import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Transaction, Account, Category, Tag } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import ReceiptScanner from '@/Components/ReceiptScanner';
import { Sparkles } from 'lucide-react';

interface TransactionsEditProps {
    transaction: Transaction;
    accounts: Account[];
    categories: Category[];
    tags: Tag[];
}

export default function TransactionsEdit({ transaction, accounts, categories, tags }: TransactionsEditProps) {
    // Format transaction_date to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Get existing tag IDs from transaction
    const existingTagIds = transaction.tags?.map(tag => tag.id) || [];

    const { data, setData, put, processing, errors } = useForm({
        account_id: transaction.account_id.toString(),
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency || 'BDT',
        category_id: transaction.category_id?.toString() || '',
        description: transaction.description || '',
        notes: transaction.notes || '',
        transaction_date: formatDate(transaction.transaction_date),
        status: transaction.status || 'completed',
        tag_ids: existingTagIds,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('transactions.update', transaction.id));
    };

    const transactionTypes = [
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
        { value: 'transfer', label: 'Transfer' },
    ];

    const statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const filteredCategories = categories.filter(cat => cat.type === data.type);

    const handleTagToggle = (tagId: number) => {
        setData('tag_ids', data.tag_ids.includes(tagId)
            ? data.tag_ids.filter(id => id !== tagId)
            : [...data.tag_ids, tagId]
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Transaction
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Scanner</span>
                    </div>
                </div>
            }
        >
            <Head title="Edit Transaction" />

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
                            <p className="text-xs text-gray-600">Scan or upload a receipt to update transaction details</p>
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
                                    onChange={(e) => setData('type', e.target.value as 'income' | 'expense' | 'transfer')}
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

                            {data.type !== 'transfer' && (
                                <div>
                                    <InputLabel htmlFor="category_id" value="Category" />
                                    <select
                                        id="category_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Select a category</option>
                                        {filteredCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>
                            )}

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

                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} className="mt-2" />
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

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    Update Transaction
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
