import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Account } from '@/types';

interface AccountsShowProps {
    account: Account;
}

export default function AccountsShow({ account }: AccountsShowProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Account Details
                </h2>
            }
        >
            <Head title="Account Details" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold">{account.name}</h3>
                            <p className="text-gray-600">Type: {account.type}</p>
                            <p className="text-gray-600">Balance: ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <Link href={route('accounts.index')} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                                ← Back to Accounts
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

