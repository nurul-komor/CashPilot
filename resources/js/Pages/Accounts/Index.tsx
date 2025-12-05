import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Account, FinancialInstitution } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Eye, EyeOff, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AccountsIndexProps {
    accounts: Account[];
    financialInstitutions: FinancialInstitution[];
}

export default function AccountsIndex({ accounts, financialInstitutions }: AccountsIndexProps) {
    const [visibleAccountNumbers, setVisibleAccountNumbers] = useState<Set<number>>(new Set());

    const toggleAccountNumberVisibility = (accountId: number) => {
        setVisibleAccountNumbers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };

    const maskAccountNumber = (accountNumber: string): string => {
        if (accountNumber.length <= 4) {
            return '***' + accountNumber;
        }
        const lastFour = accountNumber.slice(-4);
        const masked = '*'.repeat(Math.max(accountNumber.length - 4, 3));
        return masked + lastFour;
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-yellow-100 text-yellow-800',
            archived: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status as keyof typeof colors] || colors.inactive}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            cash: 'Cash',
            bank: 'Bank Account',
            credit_card: 'Credit Card',
            debit_card: 'Debit Card',
            mobile_banking: 'Mobile Banking',
            savings: 'Savings',
            investment: 'Investment',
            other: 'Other',
        };
        return labels[type] || type;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Accounts
                </h2>
            }
        >
            <Head title="Accounts" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">All Accounts</h3>
                            <p className="text-sm text-gray-500">Manage your financial accounts</p>
                        </div>
                        <Link href={route('accounts.create')}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Account</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </Link>
                    </div>

                    {accounts && accounts.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Account Number</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accounts.map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-medium">
                                                    {account.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {getTypeLabel(account.type)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {account.account_number ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 font-mono">
                                                                {visibleAccountNumbers.has(account.id)
                                                                    ? account.account_number
                                                                    : maskAccountNumber(account.account_number)}
                                                            </span>
                                                            <button
                                                                onClick={() => toggleAccountNumberVisibility(account.id)}
                                                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                                                type="button"
                                                            >
                                                                {visibleAccountNumbers.has(account.id) ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {account.currency}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(account.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('accounts.show', account.id)}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('accounts.edit', account.id)}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {accounts.map((account) => (
                                    <div key={account.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-2xl font-bold text-gray-900">
                                                ৳{parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                            {getStatusBadge(account.status)}
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Account Name:</span> {account.name}
                                            </div>
                                            <div>
                                                <span className="font-medium">Type:</span> {getTypeLabel(account.type)}
                                            </div>
                                            {account.account_number && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Account Number:</span>
                                                    <span className="font-mono">
                                                        {visibleAccountNumbers.has(account.id)
                                                            ? account.account_number
                                                            : maskAccountNumber(account.account_number)}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleAccountNumberVisibility(account.id)}
                                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                                        type="button"
                                                    >
                                                        {visibleAccountNumbers.has(account.id) ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Currency:</span> {account.currency}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <Link href={route('accounts.show', account.id)}>
                                                <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                                                    View Account Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 mb-4">No accounts yet</p>
                            <Link href={route('accounts.create')}>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create your first account
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
