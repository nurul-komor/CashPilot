import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Area, AreaChart, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Sparkles, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface ReportData {
    insights: {
        spending_trends?: string;
        top_categories?: Array<{ name: string; amount: number }>;
        savings_opportunities?: string[];
        recommendations?: string[];
        alerts?: string[];
    };
    summary: {
        total_income: number;
        total_expenses: number;
        net_savings: number;
        savings_rate: number;
    };
    spending_by_category: Record<string, number>;
    charts: {
        income_expense: Array<{ period: string; income: number; expense: number }>;
        categories: Array<{ name: string; value: number }>;
        trend: Array<{ month?: string; date?: string; income: number; expense: number }>;
    };
    generated_at: string;
}

interface ReportsIndexProps {
    reportData: ReportData;
    period: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function ReportsIndex({ reportData, period }: ReportsIndexProps) {
    const { insights, summary, charts } = reportData;

    const incomeExpenseConfig = {
        income: {
            label: 'Income',
            color: 'hsl(var(--chart-1))',
        },
        expense: {
            label: 'Expense',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    const categoryConfig = charts.categories.reduce((acc, item, index) => {
        acc[item.name.toLowerCase().replace(/\s+/g, '_')] = {
            label: item.name,
            color: COLORS[index % COLORS.length],
        };
        return acc;
    }, {} as ChartConfig);

    const handlePeriodChange = (newPeriod: string) => {
        router.get('/reports', { period: newPeriod }, { preserveState: false });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Financial Reports
                </h2>
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white shadow-md">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm font-medium">AI Powered</span>
                    </div>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="py-4 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Period Selector */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Period:</label>
                        <select
                            value={period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Generated: {new Date(reportData.generated_at).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Income</p>
                                    <p className="mt-2 text-2xl font-bold text-green-600">
                                        ৳{summary.total_income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                    <p className="mt-2 text-2xl font-bold text-red-600">
                                        ৳{summary.total_expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <TrendingDown className="h-8 w-8 text-red-500" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Net Savings</p>
                                    <p className={`mt-2 text-2xl font-bold ${summary.net_savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ৳{summary.net_savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <DollarSign className={`h-8 w-8 ${summary.net_savings >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Savings Rate</p>
                                    <p className="mt-2 text-2xl font-bold text-blue-600">
                                        {summary.savings_rate.toFixed(1)}%
                                    </p>
                                </div>
                                <Sparkles className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Income vs Expenses Bar Chart */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
                            <ChartContainer config={incomeExpenseConfig} className="min-h-[300px] w-full">
                                <BarChart accessibilityLayer data={charts.income_expense}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="period"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                                    <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                        {/* Spending by Category Pie Chart */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
                            <ChartContainer config={categoryConfig} className="min-h-[300px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Pie
                                        data={charts.categories}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {charts.categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Trend</h3>
                        <ChartContainer config={incomeExpenseConfig} className="min-h-[300px] w-full">
                            <AreaChart accessibilityLayer data={charts.trend}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey={period === 'yearly' ? 'month' : 'date'}
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    fill="var(--color-income)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-income)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    fill="var(--color-expense)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-expense)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>

                    {/* AI Insights */}
                    {insights && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {insights.spending_trends && (
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">Spending Trends</h3>
                                    </div>
                                    <p className="text-sm text-gray-700">{insights.spending_trends}</p>
                                </div>
                            )}

                            {insights.savings_opportunities && insights.savings_opportunities.length > 0 && (
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">Savings Opportunities</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {insights.savings_opportunities.map((opportunity, index) => (
                                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{opportunity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {insights.recommendations && insights.recommendations.length > 0 && (
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="h-5 w-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {insights.recommendations.map((recommendation, index) => (
                                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{recommendation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {insights.alerts && insights.alerts.length > 0 && (
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingDown className="h-5 w-5 text-red-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {insights.alerts.map((alert, index) => (
                                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-red-500 mt-1">•</span>
                                                <span>{alert}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
