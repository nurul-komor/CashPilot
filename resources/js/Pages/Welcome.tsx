import { Head, Link } from '@inertiajs/react';
import { Wallet, TrendingUp, Target, BarChart3, Shield, Smartphone, CheckCircle2, ArrowRight, Sparkles, Camera, Brain, MessageSquare, FileText, AlertTriangle, Zap } from 'lucide-react';

interface WelcomeProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        } | null;
    };
    canLogin?: boolean;
    canRegister?: boolean;
}

export default function Welcome({ auth, canLogin, canRegister }: WelcomeProps) {
    const features = [
        {
            icon: Camera,
            title: 'AI Receipt Scanner',
            description: 'Scan receipts with your camera or upload images. AI automatically extracts merchant, amount, date, and category.',
            color: 'from-purple-500 to-pink-500',
            badge: 'AI',
        },
        {
            icon: FileText,
            title: 'Document OCR',
            description: 'Scan bank statements, cards, or account documents. AI auto-fills account information instantly.',
            color: 'from-blue-500 to-cyan-500',
            badge: 'AI',
        },
        {
            icon: Brain,
            title: 'Smart Insights',
            description: 'Get AI-powered financial insights, spending trends, savings opportunities, and personalized recommendations.',
            color: 'from-indigo-500 to-purple-500',
            badge: 'AI',
        },
        {
            icon: BarChart3,
            title: 'AI Reports & Charts',
            description: 'Beautiful modern charts with AI-generated insights. Cached for fast performance with smart recommendations.',
            color: 'from-orange-500 to-red-500',
            badge: 'AI',
        },
        {
            icon: MessageSquare,
            title: 'AI Chat Assistant',
            description: 'Ask questions about your finances. Get instant answers and actionable advice from your AI assistant.',
            color: 'from-green-500 to-emerald-500',
            badge: 'AI',
        },
        {
            icon: Zap,
            title: 'Natural Language Entry',
            description: 'Type transactions naturally like "Spent $50 on groceries yesterday". AI parses and creates them automatically.',
            color: 'from-yellow-500 to-orange-500',
            badge: 'AI',
        },
        {
            icon: Wallet,
            title: 'Multiple Accounts',
            description: 'Manage cash, bank accounts, credit cards, mobile banking, and more in one place.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: TrendingUp,
            title: 'Track Transactions',
            description: 'Record income and expenses with AI-suggested categories, tags, and enhanced descriptions.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Target,
            title: 'Budget & Goals',
            description: 'Set budgets and goals with AI recommendations. Track progress with smart insights.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: AlertTriangle,
            title: 'Anomaly Detection',
            description: 'AI detects unusual transactions and spending patterns. Get alerts for potential issues.',
            color: 'from-red-500 to-pink-500',
            badge: 'AI',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your financial data is encrypted and stored securely. Complete privacy guaranteed.',
            color: 'from-indigo-500 to-blue-500',
        },
        {
            icon: Smartphone,
            title: 'Mobile First',
            description: 'Designed for mobile devices with a responsive interface that works everywhere.',
            color: 'from-violet-500 to-purple-500',
        },
    ];

    const benefits = [
        'AI-powered automation',
        'Free forever plan',
        'No credit card required',
        'Bank-level security',
        'Real-time sync',
        'Smart insights & recommendations',
        'Export your data anytime',
        '24/7 AI assistant',
    ];

    return (
        <>
            <Head title="FinGenie - AI-Powered Personal Finance Management" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Navigation */}
                <nav className="relative border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 sm:h-20 items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                                    <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    FinGenie
                                </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="group relative rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105"
                                    >
                                        <span className="hidden sm:inline">Dashboard</span>
                                        <span className="sm:hidden">Go</span>
                                        <ArrowRight className="ml-1 sm:ml-2 inline h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
                                            >
                                                <span className="hidden sm:inline">Log in</span>
                                                <span className="sm:hidden">Login</span>
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="group relative rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105"
                                            >
                                                <span className="hidden sm:inline">Get Started</span>
                                                <span className="sm:hidden">Start</span>
                                                <ArrowRight className="ml-1 sm:ml-2 inline h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-purple-700 shadow-sm backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 animate-pulse" />
                            <span className="whitespace-nowrap">Powered by AI • Smart Financial Management</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tight text-gray-900 leading-tight">
                            AI-Powered
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Personal Finance
                            </span>
                        </h1>
                        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0">
                            The smartest way to manage your money. Scan receipts, get AI insights, and track your finances
                            with cutting-edge artificial intelligence. Designed for students, employees, and small businesses.
                        </p>
                        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group relative w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl shadow-indigo-500/50 transition-all hover:shadow-3xl hover:shadow-indigo-500/50 hover:scale-105"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 inline h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="group relative w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-2xl shadow-indigo-500/50 transition-all hover:shadow-3xl hover:shadow-indigo-500/50 hover:scale-105"
                                        >
                                            Get Started Free
                                            <ArrowRight className="ml-2 inline h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="w-full sm:w-auto rounded-2xl border-2 border-gray-300 bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-900 shadow-lg transition-all hover:border-indigo-300 hover:shadow-xl"
                                        >
                                            Sign in
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Benefits List */}
                        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 px-4 sm:px-0">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 lg:py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center px-4 sm:px-0">
                        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-purple-700">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 animate-pulse" />
                            <span className="whitespace-nowrap">Powered by Google Gemini AI</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                            AI-Powered Features to
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {' '}
                                Transform Your Finances
                            </span>
                        </h2>
                        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-gray-600">
                            Experience the future of personal finance management with cutting-edge AI technology.
                            From receipt scanning to smart insights, we make managing money effortless.
                        </p>
                    </div>
                    <div className="mx-auto mt-12 sm:mt-16 md:mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
                                    <div className="relative flex items-start justify-between">
                                        <div className={`relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                            <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                        </div>
                                        {feature.badge && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold text-white shadow-sm">
                                                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                {feature.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-gray-900">{feature.title}</h3>
                                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600">10K+</div>
                                <div className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600">1M+</div>
                                <div className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Transactions Tracked</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600">99.9%</div>
                                <div className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {!auth?.user && (
                    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-10 md:p-12 shadow-2xl">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                            <div className="relative mx-auto max-w-2xl text-center px-2 sm:px-0">
                                <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white">
                                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                                    <span className="whitespace-nowrap">Start with AI-powered features</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                                    Ready to experience AI-powered finance management?
                                </h2>
                                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-indigo-100 leading-6 sm:leading-7">
                                    Join thousands of users who are already managing their money smarter with AI.
                                    Scan receipts, get insights, and automate your finances. Start your free account today.
                                </p>
                                <div className="mt-8 sm:mt-10">
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="group inline-flex items-center w-full sm:w-auto justify-center rounded-2xl bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-indigo-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                                        >
                                            Create Free Account
                                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="relative border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                                    <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    FinGenie
                                </span>
                            </div>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
                                © {new Date().getFullYear()} FinGenie. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
