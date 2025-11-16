import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

interface FinancialSettingsFormProps {
    profile: {
        currency: string;
        date_format: string;
        number_format: string;
        timezone: string;
        tax_id: string | null;
    } | null;
}

export default function FinancialSettingsForm({ profile }: FinancialSettingsFormProps) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        currency: profile?.currency || 'BDT',
        date_format: profile?.date_format || 'Y-m-d',
        number_format: profile?.number_format || 'en_US',
        timezone: profile?.timezone || 'Asia/Dhaka',
        tax_id: profile?.tax_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.financial.update'));
    };

    const currencies = [
        { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'INR', label: 'INR - Indian Rupee' },
    ];

    const dateFormats = [
        { value: 'Y-m-d', label: 'YYYY-MM-DD (2024-01-15)' },
        { value: 'd/m/Y', label: 'DD/MM/YYYY (15/01/2024)' },
        { value: 'm/d/Y', label: 'MM/DD/YYYY (01/15/2024)' },
        { value: 'd-m-Y', label: 'DD-MM-YYYY (15-01-2024)' },
    ];

    const numberFormats = [
        { value: 'en_US', label: '1,234.56 (US Format)' },
        { value: 'en_GB', label: '1,234.56 (UK Format)' },
        { value: 'de_DE', label: '1.234,56 (German Format)' },
        { value: 'bn_BD', label: '১,২৩৪.৫৬ (Bengali Format)' },
    ];

    const timezones = [
        { value: 'Asia/Dhaka', label: 'Asia/Dhaka (Bangladesh)' },
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'America/New_York' },
        { value: 'Europe/London', label: 'Europe/London' },
        { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India)' },
    ];

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Preferences</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="currency" value="Default Currency" />
                        <select
                            id="currency"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.currency}
                            onChange={(e) => setData('currency', e.target.value)}
                        >
                            {currencies.map((currency) => (
                                <option key={currency.value} value={currency.value}>
                                    {currency.label}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.currency} />
                    </div>

                    <div>
                        <InputLabel htmlFor="date_format" value="Date Format" />
                        <select
                            id="date_format"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.date_format}
                            onChange={(e) => setData('date_format', e.target.value)}
                        >
                            {dateFormats.map((format) => (
                                <option key={format.value} value={format.value}>
                                    {format.label}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.date_format} />
                    </div>

                    <div>
                        <InputLabel htmlFor="number_format" value="Number Format" />
                        <select
                            id="number_format"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.number_format}
                            onChange={(e) => setData('number_format', e.target.value)}
                        >
                            {numberFormats.map((format) => (
                                <option key={format.value} value={format.value}>
                                    {format.label}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.number_format} />
                    </div>

                    <div>
                        <InputLabel htmlFor="timezone" value="Timezone" />
                        <select
                            id="timezone"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.timezone}
                            onChange={(e) => setData('timezone', e.target.value)}
                        >
                            {timezones.map((tz) => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.timezone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="tax_id" value="Tax ID / TIN" />
                        <TextInput
                            id="tax_id"
                            className="mt-1 block w-full"
                            value={data.tax_id}
                            onChange={(e) => setData('tax_id', e.target.value)}
                            placeholder="Enter your tax identification number"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Optional: Your tax identification number for financial reports.
                        </p>
                        <InputError className="mt-2" message={errors.tax_id} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600">Saved.</p>
                </Transition>
            </div>
        </form>
    );
}



