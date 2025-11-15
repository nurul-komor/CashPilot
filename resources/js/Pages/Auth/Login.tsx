import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Wallet, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                            <Wallet className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {status && (
                    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                        <p className="text-sm font-medium text-green-800">{status}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email address" className="text-sm font-semibold text-gray-700 mb-1.5" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5 text-sm" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-sm font-semibold text-gray-700 mb-1.5" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1.5 text-sm" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <div>
                        <PrimaryButton
                            className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={processing}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {processing ? 'Signing in...' : 'SIGN IN'}
                                {!processing && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500">Don't have an account?</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('register')}
                            className="flex w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                    By signing in, you agree to our{' '}
                    <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
