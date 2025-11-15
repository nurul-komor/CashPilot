import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FinancialGoal } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Eye, Edit, Target, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoalsIndexProps {
    goals: FinancialGoal[];
}

export default function GoalsIndex({ goals }: GoalsIndexProps) {
    const calculateProgress = (current: string, target: string) => {
        const currentNum = parseFloat(current);
        const targetNum = parseFloat(target);
        if (targetNum === 0) return 0;
        return Math.min((currentNum / targetNum) * 100, 100);
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status as keyof typeof colors] || colors.active}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'bg-green-600';
        if (progress >= 75) return 'bg-blue-600';
        if (progress >= 50) return 'bg-yellow-600';
        return 'bg-gray-400';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Financial Goals
                </h2>
            }
        >
            <Head title="Financial Goals" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">All Financial Goals</h3>
                            <p className="text-sm text-gray-500">Track your savings and financial objectives</p>
                        </div>
                        <Link href={route('goals.create')}>
                            <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Set Goal</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </Link>
                    </div>
                    {goals && goals.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Goal Name</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead className="text-right">Current</TableHead>
                                            <TableHead className="text-right">Target</TableHead>
                                            <TableHead>Target Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {goals.map((goal) => {
                                            const progress = calculateProgress(goal.current_amount, goal.target_amount);
                                            return (
                                                <TableRow key={goal.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Target className="h-4 w-4 text-yellow-600" />
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {goal.name}
                                                                </div>
                                                                {goal.description && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {goal.description.substring(0, 50)}
                                                                        {goal.description.length > 50 ? '...' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="w-32">
                                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                                <span>{progress.toFixed(1)}%</span>
                                                                <TrendingUp className="h-3 w-3" />
                                                            </div>
                                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ৳{parseFloat(goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ৳{parseFloat(goal.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {goal.target_date ? (
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(goal.target_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(goal.status)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={route('goals.show', goal.id)}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={route('goals.edit', goal.id)}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {goals.map((goal) => {
                                    const progress = calculateProgress(goal.current_amount, goal.target_amount);
                                    return (
                                        <div key={goal.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ৳{parseFloat(goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                                {getStatusBadge(goal.status)}
                                            </div>

                                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Goal Name:</span> {goal.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Target Amount:</span> ৳{parseFloat(goal.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                                {goal.target_date && (
                                                    <div>
                                                        <span className="font-medium">Target Date:</span> {new Date(goal.target_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                )}
                                                {goal.description && (
                                                    <div>
                                                        <span className="font-medium">Description:</span> {goal.description.substring(0, 50)}
                                                        {goal.description.length > 50 ? '...' : ''}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                                    <span className="font-medium">Progress</span>
                                                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all ${getProgressColor(progress)}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100">
                                                <Link href={route('goals.show', goal.id)}>
                                                    <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                                                        View Goal Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 mb-4">No goals yet</p>
                            <Link href={route('goals.create')}>
                                <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700">
                                    <Plus className="h-4 w-4" />
                                    Set your first goal
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
