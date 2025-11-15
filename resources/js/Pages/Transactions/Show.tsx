import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Transaction } from '@/types';

interface TransactionsShowProps {
    transaction: Transaction;
}

export default function TransactionsShow({ transaction }: TransactionsShowProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transaction Details
                </h2>
            }
        >
            <Head title="Transaction Details" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold">{transaction.description || 'No description'}</h3>
                            <p className="text-gray-600">Amount: ৳{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p className="text-gray-600">Type: {transaction.type}</p>
                            <Link href={route('transactions.index')} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                                ← Back to Transactions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

