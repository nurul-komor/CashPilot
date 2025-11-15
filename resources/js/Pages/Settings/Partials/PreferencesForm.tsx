import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

interface PreferencesFormProps {
    profile: {
        theme: string;
        language: string;
        email_notifications: boolean;
        push_notifications: boolean;
        daily_reminder_time: string | null;
        notification_preferences: Record<string, any> | null;
    } | null;
}

export default function PreferencesForm({ profile }: PreferencesFormProps) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        theme: profile?.theme || 'light',
        language: profile?.language || 'en',
        email_notifications: profile?.email_notifications ?? true,
        push_notifications: profile?.push_notifications ?? true,
        daily_reminder_time: profile?.daily_reminder_time || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.preferences.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance & Language</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="theme" value="Theme" />
                        <select
                            id="theme"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.theme}
                            onChange={(e) => setData('theme', e.target.value)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                        <InputError className="mt-2" message={errors.theme} />
                    </div>

                    <div>
                        <InputLabel htmlFor="language" value="Language" />
                        <select
                            id="language"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.language}
                            onChange={(e) => setData('language', e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="bn">বাংলা (Bengali)</option>
                        </select>
                        <InputError className="mt-2" message={errors.language} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Checkbox
                            name="email_notifications"
                            checked={data.email_notifications}
                            onChange={(e) => setData('email_notifications', e.target.checked)}
                        />
                        <InputLabel htmlFor="email_notifications" value="Email Notifications" className="ml-2" />
                    </div>
                    <InputError className="mt-2" message={errors.email_notifications} />

                    <div className="flex items-center">
                        <Checkbox
                            name="push_notifications"
                            checked={data.push_notifications}
                            onChange={(e) => setData('push_notifications', e.target.checked)}
                        />
                        <InputLabel htmlFor="push_notifications" value="Push Notifications" className="ml-2" />
                    </div>
                    <InputError className="mt-2" message={errors.push_notifications} />

                    <div>
                        <InputLabel htmlFor="daily_reminder_time" value="Daily Reminder Time" />
                        <TextInput
                            id="daily_reminder_time"
                            type="time"
                            className="mt-1 block w-full"
                            value={data.daily_reminder_time}
                            onChange={(e) => setData('daily_reminder_time', e.target.value)}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Set a time to receive daily reminders about your finances.
                        </p>
                        <InputError className="mt-2" message={errors.daily_reminder_time} />
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

