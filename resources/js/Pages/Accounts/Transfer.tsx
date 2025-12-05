import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Account, Tag, Category } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import SearchableSelect from '@/Components/SearchableSelect';
import ReceiptScanner from '@/Components/ReceiptScanner';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface AccountsTransferProps {
    accounts: Account[];
    categories: Category[];
    tags: Tag[];
}

export default function AccountsTransfer({ accounts, categories: initialCategories, tags }: AccountsTransferProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const { data, setData, post, processing, errors, reset } = useForm({
        from_account_id: '',
        to_account_id: '',
        amount: '',
        conversion_rate: '',
        transaction_type: 'general', // Default to general, can be changed to savings
        category_id: '',
        description: '',
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0],
        tag_ids: [] as number[],
        receipt: null as File | null,
    });

    const [fromAccount, setFromAccount] = useState<Account | null>(null);
    const [toAccount, setToAccount] = useState<Account | null>(null);
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

    const availableFromAccounts = accounts.filter(acc =>
        acc.status === 'active' && parseFloat(acc.balance) > 0
    );

    const availableToAccounts = accounts.filter(acc =>
        acc.status === 'active' && acc.id.toString() !== data.from_account_id
    );

    useEffect(() => {
        const from = accounts.find(acc => acc.id.toString() === data.from_account_id);
        const to = accounts.find(acc => acc.id.toString() === data.to_account_id);
        setFromAccount(from || null);
        setToAccount(to || null);

        // Auto-set conversion rate to 1 if currencies are the same
        if (from && to && from.currency === to.currency) {
            if (!data.conversion_rate || data.conversion_rate === '') {
                setData('conversion_rate', '1.0');
            }
        }

        // Calculate destination amount
        if (data.amount && data.conversion_rate) {
            const amount = parseFloat(data.amount);
            const rate = parseFloat(data.conversion_rate);
            if (!isNaN(amount) && !isNaN(rate) && rate > 0) {
                setCalculatedAmount(amount * rate);
            } else {
                setCalculatedAmount(null);
            }
        } else {
            setCalculatedAmount(null);
        }
    }, [data.from_account_id, data.to_account_id, data.amount, data.conversion_rate]);

    const needsConversion = fromAccount && toAccount && fromAccount.currency !== toAccount.currency;

    const handleTagToggle = (tagId: number) => {
        setData('tag_ids', data.tag_ids.includes(tagId)
            ? data.tag_ids.filter(id => id !== tagId)
            : [...data.tag_ids, tagId]
        );
    };

    const handleCreateCategory = async (name: string): Promise<Category> => {
        // Check if category already exists (case-insensitive)
        const existingCategory = categories.find(
            cat => cat.name.toLowerCase().trim() === name.toLowerCase().trim()
        );

        if (existingCategory) {
            // Return existing category instead of creating a new one
            return existingCategory;
        }

        // Use the transaction type to determine category type
        // For savings and general, use 'income' type category
        const categoryType = data.transaction_type === 'savings' || data.transaction_type === 'general' ? 'income' : 'expense';

        const response = await axios.post(route('categories.store'), {
            name,
            type: categoryType,
        });

        const newCategory = response.data;
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure conversion_rate is set for same-currency transfers
        if (!needsConversion && (!data.conversion_rate || data.conversion_rate === '')) {
            setData('conversion_rate', '1.0');
        }

        post(route('accounts.transfer.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFromAccount(null);
                setToAccount(null);
                setCalculatedAmount(null);
                router.reload({ only: ['accounts'] });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transfer Between Accounts
                </h2>
            }
        >
            <Head title="Transfer" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('accounts.index')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Accounts
                        </Link>
                    </div>

                    {/* AI Receipt Scanner */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm sm:rounded-lg border border-purple-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-gray-900">AI Receipt Scanner</h3>
                            </div>
                            <p className="text-xs text-gray-600">Scan or upload a receipt to auto-fill transfer details</p>
                        </div>
                        <div className="p-6">
                            <ReceiptScanner
                                onDataExtracted={(extractedData) => {
                                    if (extractedData.merchant) setData('description', extractedData.merchant);
                                    if (extractedData.amount) setData('amount', extractedData.amount);
                                    if (extractedData.transaction_date) setData('transaction_date', extractedData.transaction_date);
                                    if (extractedData.notes) setData('notes', extractedData.notes);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="from_account_id" value="From Account *" />
                                <select
                                    id="from_account_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.from_account_id}
                                    onChange={(e) => setData('from_account_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select source account</option>
                                    {availableFromAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({account.type}) - {account.currency} {parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                </select>
                                {fromAccount && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Available: {fromAccount.currency} {parseFloat(fromAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                )}
                                <InputError message={errors.from_account_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="to_account_id" value="To Account *" />
                                <select
                                    id="to_account_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.to_account_id}
                                    onChange={(e) => setData('to_account_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select destination account</option>
                                    {availableToAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({account.type}) - {account.currency} {parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                </select>
                                {toAccount && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Current balance: {toAccount.currency} {parseFloat(toAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                )}
                                <InputError message={errors.to_account_id} className="mt-2" />
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
                                />
                                {fromAccount && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Amount in {fromAccount.currency}
                                    </p>
                                )}
                                <InputError message={errors.amount} className="mt-2" />
                            </div>

                            {needsConversion && (
                                <div>
                                    <InputLabel htmlFor="conversion_rate" value={`Conversion Rate (${fromAccount?.currency} to ${toAccount?.currency}) *`} />
                                    <TextInput
                                        id="conversion_rate"
                                        type="number"
                                        step="0.0001"
                                        min="0.0001"
                                        className="mt-1 block w-full"
                                        value={data.conversion_rate}
                                        onChange={(e) => setData('conversion_rate', e.target.value)}
                                        placeholder="e.g., 0.012 (for USD to BDT)"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        1 {fromAccount?.currency} = {data.conversion_rate || '?'} {toAccount?.currency}
                                    </p>
                                    {calculatedAmount !== null && (
                                        <p className="mt-1 text-sm font-medium text-indigo-600">
                                            Will receive: {toAccount?.currency} {calculatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    )}
                                    <InputError message={errors.conversion_rate} className="mt-2" />
                                </div>
                            )}

                            {!needsConversion && (
                                <input type="hidden" name="conversion_rate" value="1.0" />
                            )}

                            <div>
                                <InputLabel htmlFor="transaction_type" value="Transaction Type (for destination account)" />
                                <select
                                    id="transaction_type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.transaction_type}
                                    onChange={(e) => setData('transaction_type', e.target.value as 'general' | 'savings')}
                                >
                                    <option value="general">General</option>
                                    <option value="savings">Savings</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    Select how this transfer should be categorized in the destination account
                                </p>
                                <InputError message={errors.transaction_type} className="mt-2" />
                            </div>

                            <div>
                                <SearchableSelect
                                    options={categories}
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
                                    placeholder="e.g., Transfer to savings"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="transaction_date" value="Transfer Date *" />
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
                                    placeholder="Additional notes about this transfer..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

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
                                    Transfer Funds
                                </PrimaryButton>
                                <Link href={route('accounts.index')}>
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
