import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ProfileInformationForm from './Partials/ProfileInformationForm';
import AccountSettingsForm from './Partials/AccountSettingsForm';
import PreferencesForm from './Partials/PreferencesForm';
import FinancialSettingsForm from './Partials/FinancialSettingsForm';

interface SettingsIndexProps {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        profile: {
            // Personal Information
            phone: string | null;
            date_of_birth: string | null;
            gender: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string;
            postal_code: string | null;
            national_id: string | null;
            emergency_contact_name: string | null;
            emergency_contact_phone: string | null;
            emergency_contact_relationship: string | null;
            bio: string | null;
            profile_picture: string | null;
            // Professional Information
            job_title: string | null;
            company: string | null;
            industry: string | null;
            github_url: string | null;
            linkedin_url: string | null;
            portfolio_url: string | null;
            // Financial Settings
            currency: string;
            date_format: string;
            number_format: string;
            timezone: string;
            tax_id: string | null;
            // Application Preferences
            theme: string;
            language: string;
            email_notifications: boolean;
            push_notifications: boolean;
            daily_reminder_time: string | null;
            notification_preferences: Record<string, any> | null;
        } | null;
    };
    mustVerifyEmail: boolean;
    status?: string;
}

type TabType = 'profile' | 'account' | 'preferences' | 'financial';

export default function SettingsIndex({ user, mustVerifyEmail, status }: SettingsIndexProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    const tabs = [
        { id: 'profile' as TabType, name: 'Profile Information', icon: '👤' },
        { id: 'account' as TabType, name: 'Account Settings', icon: '🔐' },
        { id: 'preferences' as TabType, name: 'Preferences', icon: '⚙️' },
        { id: 'financial' as TabType, name: 'Financial Settings', icon: '💰' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                                            ${
                                                activeTab === tab.id
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }
                                        `}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'profile' && (
                                <ProfileInformationForm
                                    user={user}
                                    profile={user.profile}
                                />
                            )}

                            {activeTab === 'account' && (
                                <AccountSettingsForm
                                    user={user}
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            )}

                            {activeTab === 'preferences' && (
                                <PreferencesForm
                                    profile={user.profile}
                                />
                            )}

                            {activeTab === 'financial' && (
                                <FinancialSettingsForm
                                    profile={user.profile}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
