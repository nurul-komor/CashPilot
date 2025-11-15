import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Wallet, Sparkles } from 'lucide-react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Logo and Branding */}
            <div className="relative z-10 mb-6 sm:mb-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            FinGenie
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 animate-pulse" />
                            <span className="text-xs sm:text-sm text-gray-600 font-medium">AI-Powered Finance</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
                <div className="overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20">
                    <div className="px-6 sm:px-8 py-6 sm:py-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer Link */}
            <div className="relative z-10 mt-6 sm:mt-8 text-center">
                <Link
                    href="/"
                    className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    ← Back to home
                </Link>
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
        </div>
    );
}
