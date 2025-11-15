import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Wallet, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordRequirements = [
        { text: 'At least 8 characters', met: data.password.length >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(data.password) },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(data.password) },
        { text: 'Contains number', met: /[0-9]/.test(data.password) },
    ];

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                            <Wallet className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Start managing your finances today
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Full name" className="text-sm font-semibold text-gray-700 mb-1.5" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1.5 text-sm" />
                    </div>

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
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5 text-sm" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="I am a" className="text-sm font-semibold text-gray-700 mb-1.5" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                        >
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                            <option value="businessman">Small Businessman</option>
                        </select>
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {data.password && (
                            <div className="mt-2 space-y-1">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center text-xs">
                                        <CheckCircle2
                                            className={`h-3 w-3 mr-2 flex-shrink-0 ${req.met ? 'text-green-500' : 'text-gray-300'}`}
                                        />
                                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.password} className="mt-1.5 text-sm" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm password"
                            className="text-sm font-semibold text-gray-700 mb-1.5"
                        />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1.5 text-sm" />
                    </div>

                    <div>
                        <PrimaryButton
                            className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={processing}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {processing ? 'Creating account...' : 'CREATE ACCOUNT'}
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
                            <span className="bg-white px-4 text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('login')}
                            className="flex w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                    By creating an account, you agree to our{' '}
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
