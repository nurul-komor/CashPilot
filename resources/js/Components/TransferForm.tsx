import { useForm } from '@inertiajs/react';
import { Account } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface TransferFormProps {
    accounts: Account[];
    onSuccess?: () => void;
}

export default function TransferForm({ accounts, onSuccess }: TransferFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        from_account_id: '',
        to_account_id: '',
        amount: '',
        conversion_rate: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure conversion_rate is set for same-currency transfers
        if (!needsConversion && (!data.conversion_rate || data.conversion_rate === '')) {
            setData('conversion_rate', '1.0');
        }

        post(route('accounts.transfer.store'), {
            onSuccess: () => {
                reset();
                setFromAccount(null);
                setToAccount(null);
                setCalculatedAmount(null);
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.reload({ only: ['accounts'] });
                }
            },
        });
    };

    const needsConversion = fromAccount && toAccount && fromAccount.currency !== toAccount.currency;

    return (
        <form onSubmit={submit} className="space-y-4">
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

            <div className="pt-2">
                <PrimaryButton disabled={processing} className="w-full">
                    {processing ? 'Processing...' : 'Transfer Funds'}
                </PrimaryButton>
            </div>
        </form>
    );
}

