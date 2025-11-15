import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FinancialGoal } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import AccountDocumentScanner from '@/Components/AccountDocumentScanner';
import { Sparkles } from 'lucide-react';

interface GoalsEditProps {
    goal: FinancialGoal;
}

export default function GoalsEdit({ goal }: GoalsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: goal.name,
        description: goal.description || '',
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        currency: goal.currency,
        target_date: goal.target_date || '',
        status: goal.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('goals.update', goal.id));
    };

    const statuses = [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Goal
                    </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Scanner</span>
                    </div>
                </div>
            }
        >
            <Head title="Edit Goal" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('goals.index')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Goals
                        </Link>
                    </div>

                    {/* AI Document Scanner */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm sm:rounded-lg border border-purple-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-gray-900">AI Document Scanner</h3>
                            </div>
                            <p className="text-xs text-gray-600">Scan goal documents to update goal information</p>
                        </div>
                        <div className="p-6">
                            <AccountDocumentScanner
                                onDataExtracted={(extractedData) => {
                                    if (extractedData.name) setData('name', extractedData.name);
                                    if (extractedData.balance) setData('target_amount', extractedData.balance);
                                    if (extractedData.currency) setData('currency', extractedData.currency);
                                    if (extractedData.notes) setData('description', extractedData.notes);
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Goal Name *" />
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
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="target_amount" value="Target Amount *" />
                                <TextInput
                                    id="target_amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="mt-1 block w-full"
                                    value={data.target_amount}
                                    onChange={(e) => setData('target_amount', e.target.value)}
                                    required
                                />
                                <InputError message={errors.target_amount} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="current_amount" value="Current Amount" />
                                <TextInput
                                    id="current_amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="mt-1 block w-full"
                                    value={data.current_amount}
                                    onChange={(e) => setData('current_amount', e.target.value)}
                                />
                                <InputError message={errors.current_amount} className="mt-2" />
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
                                <InputLabel htmlFor="target_date" value="Target Date" />
                                <TextInput
                                    id="target_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.target_date}
                                    onChange={(e) => setData('target_date', e.target.value)}
                                />
                                <InputError message={errors.target_date} className="mt-2" />
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

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    Update Goal
                                </PrimaryButton>
                                <Link href={route('goals.index')}>
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
