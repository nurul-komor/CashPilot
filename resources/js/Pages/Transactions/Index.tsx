import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Transaction, Account, Category, Tag } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Eye, Edit, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionsIndexProps {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    tags: Tag[];
    filters: Record<string, any>;
}

export default function TransactionsIndex({ transactions, accounts, categories, tags, filters }: TransactionsIndexProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowDownRight className="h-4 w-4 text-green-600" />;
            case 'expense':
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;
            case 'transfer':
                return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
            default:
                return null;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'income':
                return 'text-green-600';
            case 'expense':
                return 'text-red-600';
            case 'transfer':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTypeBgColor = (type: string) => {
        switch (type) {
            case 'income':
                return 'bg-green-100';
            case 'expense':
                return 'bg-red-100';
            case 'transfer':
                return 'bg-blue-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status as keyof typeof colors] || colors.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transactions
                </h2>
            }
        >
            <Head title="Transactions" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                            <p className="text-sm text-gray-500">View and manage your financial transactions</p>
                        </div>
                        <Link href={route('transactions.create')}>
                            <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Transaction</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </Link>
                    </div>
                    {transactions && transactions.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(transaction.type)}
                                                        <span className={`text-sm font-medium capitalize ${getTypeColor(transaction.type)}`}>
                                                            {transaction.type}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-gray-900">
                                                        {transaction.description || 'No description'}
                                                    </div>
                                                    {transaction.notes && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {transaction.notes.substring(0, 50)}
                                                            {transaction.notes.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.category ? (
                                                        <span className="text-sm text-gray-600">
                                                            {transaction.category.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                                                        {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                                                        ৳{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(transaction.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('transactions.show', transaction.id)}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('transactions.edit', transaction.id)}>
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
                                {transactions.map((transaction) => (
                                    <div key={transaction.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`text-2xl font-bold ${getTypeColor(transaction.type)}`}>
                                                {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                                                ৳{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                            {getStatusBadge(transaction.status)}
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Description:</span> {transaction.description || 'No description'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Transaction Date:</span> {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                            <div>
                                                <span className="font-medium">Type:</span> <span className="capitalize">{transaction.type}</span>
                                            </div>
                                            {transaction.category && (
                                                <div>
                                                    <span className="font-medium">Category:</span> {transaction.category.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex gap-2">
                                                <Link href={route('transactions.edit', transaction.id)} className="flex-1">
                                                    <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Link href={route('transactions.show', transaction.id)} className="flex-1">
                                                    <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 mb-4">No transactions yet</p>
                            <Link href={route('transactions.create')}>
                                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4" />
                                    Add your first transaction
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
