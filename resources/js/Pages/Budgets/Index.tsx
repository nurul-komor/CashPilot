import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Budget, Category } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Eye, Edit, Calendar, DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BudgetsIndexProps {
    budgets: Budget[];
    categories: Category[];
}

export default function BudgetsIndex({ budgets, categories }: BudgetsIndexProps) {
    const getPeriodLabel = (budget: Budget) => {
        if (budget.period_type === 'monthly') {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return budget.month ? `${monthNames[budget.month - 1]} ${budget.year}` : `${budget.year}`;
        }
        return `${budget.year}`;
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Inactive
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Budgets
                </h2>
            }
        >
            <Head title="Budgets" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">All Budgets</h3>
                            <p className="text-sm text-gray-500">Manage your monthly and yearly budgets</p>
                        </div>
                        <Link href={route('budgets.create')}>
                            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Create Budget</span>
                                <span className="sm:hidden">Create</span>
                            </Button>
                        </Link>
                    </div>
                    {budgets && budgets.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Budget Name</TableHead>
                                            <TableHead>Period</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">Total Amount</TableHead>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {budgets.map((budget) => (
                                            <TableRow key={budget.id}>
                                                <TableCell className="font-medium">
                                                    {budget.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {getPeriodLabel(budget)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600 capitalize">
                                                        {budget.period_type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            ৳{parseFloat(budget.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {budget.currency}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(budget.is_active)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('budgets.show', budget.id)}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('budgets.edit', budget.id)}>
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
                                {budgets.map((budget) => (
                                    <div key={budget.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-2xl font-bold text-gray-900">
                                                ৳{parseFloat(budget.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                            {getStatusBadge(budget.is_active)}
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Budget Name:</span> {budget.name}
                                            </div>
                                            <div>
                                                <span className="font-medium">Period:</span> {getPeriodLabel(budget)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Type:</span> <span className="capitalize">{budget.period_type}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Currency:</span> {budget.currency}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <Link href={route('budgets.show', budget.id)}>
                                                <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                                                    View Budget Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 mb-4">No budgets yet</p>
                            <Link href={route('budgets.create')}>
                                <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                                    <Plus className="h-4 w-4" />
                                    Create your first budget
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
