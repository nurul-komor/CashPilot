import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FinancialGoal } from '@/types';

interface GoalsShowProps {
    goal: FinancialGoal;
}

export default function GoalsShow({ goal }: GoalsShowProps) {
    const progress = (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Goal Details
                </h2>
            }
        >
            <Head title="Goal Details" />
            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold">{goal.name}</h3>
                            <p className="text-gray-600">Target: ৳{parseFloat(goal.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p className="text-gray-600">Current: ৳{parseFloat(goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p className="text-gray-600">Progress: {progress.toFixed(1)}%</p>
                            <Link href={route('goals.index')} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                                ← Back to Goals
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

