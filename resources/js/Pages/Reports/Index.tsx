import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Area, AreaChart, YAxis } from 'recharts';
// @ts-ignore - chart.jsx doesn't have type definitions
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Sparkles, TrendingUp, TrendingDown, DollarSign, Calendar, Lightbulb, AlertTriangle, Target, BarChart3, CheckCircle2, ChevronDown, PiggyBank } from 'lucide-react';
import { Disclosure } from '@headlessui/react';

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
                                    <p className="text-sm font-medium text-gray-600">Savings Amount</p>
                                    <p className={`mt-2 text-2xl font-bold ${(summary.net_savings || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ৳{summary?.net_savings?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                    </p>
                                </div>
                                <PiggyBank className={`h-8 w-8 ${(summary.net_savings || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
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
                                        {charts.categories.map((_, index) => (
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

                    {/* AI Insights & Recommendations */}
                    {insights && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-purple-600" />
                                <h2 className="text-2xl font-bold text-gray-900">AI Insights & Recommendations</h2>
                            </div>

                            <div className="space-y-2">
                                {/* Top Spending Categories */}
                                {charts.categories && charts.categories.length > 0 && (
                                    <Disclosure>
                                        {({ open }) => (
                                            <div className="overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                                                <Disclosure.Button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">Top Spending Categories</h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">
                                                                {charts.categories?.length ?? 0} categories
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pb-4 pt-2">
                                                    <div className="space-y-2">
                                                        {charts.categories.slice(0, 5).map((category, index) => {
                                                            const amount = category?.value ?? 0;
                                                            const categoryName = category?.name ?? 'Uncategorized';
                                                            const displayAmount = Number.isNaN(Number(amount)) || amount === null || amount === undefined ? 0 : Number(amount);
                                                            return (
                                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                                        <span className="font-medium text-gray-900">{categoryName}</span>
                                                                    </div>
                                                                    <span className="font-semibold text-gray-700">
                                                                        ৳{displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                )}

                                {/* Spending Trends */}
                                {insights.spending_trends && (
                                    <Disclosure>
                                        {({ open }) => (
                                            <div className="overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                                                <Disclosure.Button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <TrendingUp className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">Spending Analysis</h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">Detailed spending trends and patterns</p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pb-4 pt-2">
                                                    <div className="prose prose-sm max-w-none">
                                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                            {insights.spending_trends}
                                                        </p>
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                )}

                                {/* Savings Opportunities */}
                                {insights.savings_opportunities && insights.savings_opportunities.length > 0 && (
                                    <Disclosure>
                                        {({ open }) => (
                                            <div className="overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                                                <Disclosure.Button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <Target className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">Savings Opportunities</h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">
                                                                {insights.savings_opportunities?.length ?? 0} opportunity{(insights.savings_opportunities?.length ?? 0) > 1 ? 'ies' : 'y'} identified
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pb-4 pt-2">
                                                    <div className="space-y-2">
                                                        {(insights.savings_opportunities ?? []).map((opportunity, index) => (
                                                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <p className="text-sm text-gray-700 leading-relaxed">{opportunity}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                )}

                                {/* AI Recommendations */}
                                {insights.recommendations && insights.recommendations.length > 0 && (
                                    <Disclosure defaultOpen>
                                        {({ open }) => (
                                            <div className="overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                                                <Disclosure.Button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Lightbulb className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">Actionable Recommendations</h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">
                                                                {insights.recommendations?.length ?? 0} recommendation{(insights.recommendations?.length ?? 0) > 1 ? 's' : ''} for you
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pb-4 pt-2">
                                                    <div className="space-y-2">
                                                        {(insights.recommendations ?? []).map((recommendation, index) => (
                                                            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                                                                    {index + 1}
                                                                </div>
                                                                <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                )}

                                {/* Alerts */}
                                {insights.alerts && insights.alerts.length > 0 && (
                                    <Disclosure defaultOpen>
                                        {({ open }) => (
                                            <div className="overflow-hidden rounded-lg bg-white border-2 border-red-200 shadow-sm">
                                                <Disclosure.Button className="flex w-full items-center justify-between p-4 text-left hover:bg-red-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-100 rounded-lg">
                                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">Important Alerts</h3>
                                                            <p className="text-sm text-red-600 mt-0.5">
                                                                {insights.alerts?.length ?? 0} alert{(insights.alerts?.length ?? 0) > 1 ? 's' : ''} require{(insights.alerts?.length ?? 0) > 1 ? '' : 's'} attention
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-red-500 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pb-4 pt-2">
                                                    <div className="space-y-2">
                                                        {(insights.alerts ?? []).map((alert, index) => (
                                                            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                                                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{alert}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
