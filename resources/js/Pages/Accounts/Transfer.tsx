import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Account } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

interface AccountsTransferProps {
    accounts: Account[];
}

export default function AccountsTransfer({ accounts }: AccountsTransferProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        from_account_id: '',
        to_account_id: '',
        amount: '',
        currency: 'BDT',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('accounts.transfer.store'), {
            onSuccess: () => reset(),
        });
    };

    const availableFromAccounts = accounts.filter(acc =>
        acc.status === 'active' && parseFloat(acc.balance) > 0
    );

    const availableToAccounts = accounts.filter(acc => acc.status === 'active');

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
                                    isFocused
                                >
                                    <option value="">Select source account</option>
                                    {availableFromAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({account.type}) - ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                </select>
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
                                    {availableToAccounts
                                        .filter(acc => acc.id.toString() !== data.from_account_id)
                                        .map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.name} ({account.type}) - ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </option>
                                        ))}
                                </select>
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
