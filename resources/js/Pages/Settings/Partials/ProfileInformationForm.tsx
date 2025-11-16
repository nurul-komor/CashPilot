import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

interface ProfileInformationFormProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    profile: {
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
        job_title: string | null;
        company: string | null;
        industry: string | null;
        github_url: string | null;
        linkedin_url: string | null;
        portfolio_url: string | null;
    } | null;
}

export default function ProfileInformationForm({ user, profile }: ProfileInformationFormProps) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        // Personal Information
        phone: profile?.phone || '',
        date_of_birth: profile?.date_of_birth || '',
        gender: profile?.gender || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        country: profile?.country || 'BD',
        postal_code: profile?.postal_code || '',
        national_id: profile?.national_id || '',
        emergency_contact_name: profile?.emergency_contact_name || '',
        emergency_contact_phone: profile?.emergency_contact_phone || '',
        emergency_contact_relationship: profile?.emergency_contact_relationship || '',
        bio: profile?.bio || '',
        // Professional Information
        job_title: profile?.job_title || '',
        company: profile?.company || '',
        industry: profile?.industry || '',
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        portfolio_url: profile?.portfolio_url || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.profile.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number" />
                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                        <TextInput
                            id="date_of_birth"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.date_of_birth} />
                    </div>

                    <div>
                        <InputLabel htmlFor="gender" value="Gender" />
                        <select
                            id="gender"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                        <InputError className="mt-2" message={errors.gender} />
                    </div>

                    <div>
                        <InputLabel htmlFor="national_id" value="National ID" />
                        <TextInput
                            id="national_id"
                            className="mt-1 block w-full"
                            value={data.national_id}
                            onChange={(e) => setData('national_id', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.national_id} />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="address" value="Address" />
                        <textarea
                            id="address"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.address} />
                    </div>

                    <div>
                        <InputLabel htmlFor="city" value="City" />
                        <TextInput
                            id="city"
                            className="mt-1 block w-full"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.city} />
                    </div>

                    <div>
                        <InputLabel htmlFor="state" value="State/Province" />
                        <TextInput
                            id="state"
                            className="mt-1 block w-full"
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.state} />
                    </div>

                    <div>
                        <InputLabel htmlFor="postal_code" value="Postal Code" />
                        <TextInput
                            id="postal_code"
                            className="mt-1 block w-full"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.postal_code} />
                    </div>

                    <div>
                        <InputLabel htmlFor="country" value="Country" />
                        <TextInput
                            id="country"
                            className="mt-1 block w-full"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.country} />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="bio" value="Bio" />
                        <textarea
                            id="bio"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                        <InputError className="mt-2" message={errors.bio} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="emergency_contact_name" value="Contact Name" />
                        <TextInput
                            id="emergency_contact_name"
                            className="mt-1 block w-full"
                            value={data.emergency_contact_name}
                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.emergency_contact_name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="emergency_contact_phone" value="Contact Phone" />
                        <TextInput
                            id="emergency_contact_phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.emergency_contact_phone}
                            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.emergency_contact_phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="emergency_contact_relationship" value="Relationship" />
                        <TextInput
                            id="emergency_contact_relationship"
                            className="mt-1 block w-full"
                            value={data.emergency_contact_relationship}
                            onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                            placeholder="e.g., Spouse, Parent, Sibling"
                        />
                        <InputError className="mt-2" message={errors.emergency_contact_relationship} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="job_title" value="Job Title" />
                        <TextInput
                            id="job_title"
                            className="mt-1 block w-full"
                            value={data.job_title}
                            onChange={(e) => setData('job_title', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.job_title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="company" value="Company" />
                        <TextInput
                            id="company"
                            className="mt-1 block w-full"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.company} />
                    </div>

                    <div>
                        <InputLabel htmlFor="industry" value="Industry" />
                        <TextInput
                            id="industry"
                            className="mt-1 block w-full"
                            value={data.industry}
                            onChange={(e) => setData('industry', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.industry} />
                    </div>

                    <div>
                        <InputLabel htmlFor="github_url" value="GitHub URL" />
                        <TextInput
                            id="github_url"
                            type="url"
                            className="mt-1 block w-full"
                            value={data.github_url}
                            onChange={(e) => setData('github_url', e.target.value)}
                            placeholder="https://github.com/username"
                        />
                        <InputError className="mt-2" message={errors.github_url} />
                    </div>

                    <div>
                        <InputLabel htmlFor="linkedin_url" value="LinkedIn URL" />
                        <TextInput
                            id="linkedin_url"
                            type="url"
                            className="mt-1 block w-full"
                            value={data.linkedin_url}
                            onChange={(e) => setData('linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                        />
                        <InputError className="mt-2" message={errors.linkedin_url} />
                    </div>

                    <div>
                        <InputLabel htmlFor="portfolio_url" value="Portfolio URL" />
                        <TextInput
                            id="portfolio_url"
                            type="url"
                            className="mt-1 block w-full"
                            value={data.portfolio_url}
                            onChange={(e) => setData('portfolio_url', e.target.value)}
                            placeholder="https://yourportfolio.com"
                        />
                        <InputError className="mt-2" message={errors.portfolio_url} />
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


