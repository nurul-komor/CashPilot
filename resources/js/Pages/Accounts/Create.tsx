import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FinancialInstitution } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import AccountDocumentScanner from '@/Components/AccountDocumentScanner';
import { Sparkles } from 'lucide-react';

interface AccountsCreateProps {
    financialInstitutions: FinancialInstitution[];
}

export default function AccountsCreate({ financialInstitutions }: AccountsCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'cash',
        financial_institution_id: '',
        account_number: '',
        balance: '0',
        currency: 'BDT',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('accounts.store'), {
            onSuccess: () => reset(),
        });
    };

    const accountTypes = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank', label: 'Bank Account' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'mobile_banking', label: 'Mobile Banking' },
        { value: 'savings', label: 'Savings Account' },
        { value: 'investment', label: 'Investment' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Account
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Scanner</span>
                    </div>
                </div>
            }
        >
            <Head title="Create Account" />

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

                    {/* AI Document Scanner */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm sm:rounded-lg border border-purple-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-gray-900">AI Document Scanner</h3>
                            </div>
                            <p className="text-xs text-gray-600">Scan bank statements, cards, or account documents to auto-fill form fields</p>
                        </div>
                        <div className="p-6">
                            <AccountDocumentScanner
                                onDataExtracted={(extractedData) => {
                                    if (extractedData.name) setData('name', extractedData.name);
                                    if (extractedData.type) setData('type', extractedData.type);
                                    if (extractedData.financial_institution_id) setData('financial_institution_id', extractedData.financial_institution_id);
                                    if (extractedData.account_number) setData('account_number', extractedData.account_number);
                                    if (extractedData.balance) setData('balance', extractedData.balance);
                                    if (extractedData.currency) setData('currency', extractedData.currency);
                                    if (extractedData.notes) setData('notes', extractedData.notes);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Account Name *" />
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
                                <InputLabel htmlFor="type" value="Account Type *" />
                                <select
                                    id="type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                >
                                    {accountTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            {(data.type === 'bank' || data.type === 'mobile_banking' || data.type === 'credit_card' || data.type === 'debit_card') && (
                                <div>
                                    <InputLabel htmlFor="financial_institution_id" value={data.type === 'bank' || data.type === 'credit_card' || data.type === 'debit_card' ? 'Bank' : 'Mobile Banking Service'} />
                                    <select
                                        id="financial_institution_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.financial_institution_id}
                                        onChange={(e) => setData('financial_institution_id', e.target.value)}
                                    >
                                        <option value="">Select {data.type === 'bank' || data.type === 'credit_card' || data.type === 'debit_card' ? 'a bank' : 'a service'}</option>
                                        {financialInstitutions
                                            .filter(fi => {
                                                if (data.type === 'bank' || data.type === 'credit_card' || data.type === 'debit_card') {
                                                    return fi.type === 'bank';
                                                } else if (data.type === 'mobile_banking') {
                                                    return fi.type === 'mobile_banking';
                                                }
                                                return false;
                                            })
                                            .map((institution) => (
                                                <option key={institution.id} value={institution.id}>
                                                    {institution.name}
                                                </option>
                                            ))}
                                    </select>
                                    <InputError message={errors.financial_institution_id} className="mt-2" />
                                </div>
                            )}

                            {(data.type === 'bank' || data.type === 'mobile_banking' || data.type === 'credit_card' || data.type === 'debit_card') && (
                                <div>
                                    <InputLabel htmlFor="account_number" value="Account Number" />
                                    <TextInput
                                        id="account_number"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.account_number}
                                        onChange={(e) => setData('account_number', e.target.value)}
                                    />
                                    <InputError message={errors.account_number} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="balance" value="Initial Balance" />
                                <TextInput
                                    id="balance"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="mt-1 block w-full"
                                    value={data.balance}
                                    onChange={(e) => setData('balance', e.target.value)}
                                />
                                <InputError message={errors.balance} className="mt-2" />
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
                                    Create Account
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
