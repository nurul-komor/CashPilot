import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Education {
    id: number;
    degree_diploma: string;
    institution: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string;
    gpa: number | null;
    description: string | null;
}

interface Skill {
    id: number;
    name: string;
    category: string;
    proficiency_level: string | null;
}

interface WorkExperience {
    id: number;
    job_title: string;
    company: string;
    employment_type: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
    description: string | null;
    achievements: string | null;
}

interface Project {
    id: number;
    name: string;
    role: string | null;
    technologies: string | null;
    description: string | null;
    live_link: string | null;
    source_code_link: string | null;
    start_date: string | null;
    end_date: string | null;
    client_company: string | null;
}

interface ShowProps {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        role: string;
        created_at: string;
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
        education?: Education[];
        skills?: Skill[];
        workExperiences?: WorkExperience[];
        projects?: Project[];
    };
    mustVerifyEmail: boolean;
}

export default function Show({ user }: ShowProps) {
    const profile = user.profile;

    // Ensure arrays are defined
    const education = user.education || [];
    const skills = user.skills || [];
    const workExperiences = user.workExperiences || [];
    const projects = user.projects || [];

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const formatDateRange = (start: string | null, end: string | null) => {
        if (!start) return '';
        const startFormatted = formatDate(start);
        const endFormatted = end ? formatDate(end) : 'Now';
        return `${startFormatted} - ${endFormatted}`;
    };

    const formatYear = (date: string | null) => {
        if (!date) return '';
        return new Date(date).getFullYear().toString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile
                    </h2>
                    <Link
                        href={route('profile.edit')}
                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Edit Profile
                    </Link>
                </div>
            }
        >
            <Head title={`${user.name} - Profile`} />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Resume-style Layout */}
                    <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                            {/* Left Column - Profile Picture, Education, Skills */}
                            <div className="lg:col-span-1 bg-gray-50 p-6 space-y-6">
                                {/* Profile Picture */}
                                <div className="flex justify-center">
                                    {profile?.profile_picture ? (
                                        <img
                                            src={profile.profile_picture}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                                            <span className="text-4xl font-semibold text-gray-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Education Section */}
                                {education.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                                            Education
                                        </h2>
                                        <div className="space-y-4">
                                            {education.map((edu) => (
                                                <div key={edu.id} className="border-l-2 border-gray-400 pl-3">
                                                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                                        {edu.degree_diploma}
                                                    </h3>
                                                    <p className="text-xs text-gray-700 mt-1">{edu.institution}</p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <svg
                                                            className="w-3 h-3 text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <span className="text-xs text-gray-600">
                                                            {edu.status === 'ongoing' ? 'Ongoing' : formatYear(edu.end_date) || formatYear(edu.start_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills Section */}
                                {skills.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                                            Skills
                                        </h2>
                                        <div className="space-y-4">
                                            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                                                <div key={category}>
                                                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                                                        {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                    </h3>
                                                    <ul className="space-y-1">
                                                        {categorySkills.map((skill) => (
                                                            <li key={skill.id} className="text-xs text-gray-700">
                                                                {skill.name}
                                                                {skill.proficiency_level && (
                                                                    <span className="text-gray-600 ml-1">
                                                                        ({skill.proficiency_level})
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Name, Title, Contact, Experience, Projects */}
                            <div className="lg:col-span-2 p-8 space-y-6 relative">
                                {/* Edit Profile Link */}
                                <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
                                    <Link
                                        href={route('profile.edit')}
                                        className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-2 text-xs lg:text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                                    >
                                        <svg
                                            className="w-3 h-3 lg:w-4 lg:h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">Edit Profile</span>
                                        <span className="sm:hidden">Edit</span>
                                    </Link>
                                </div>

                                {/* Name and Title */}
                                <div className="border-b border-gray-300 pb-4">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                                        {user.name.toUpperCase()}
                                    </h1>
                                    <p className="text-xl text-gray-700 font-medium">
                                        {profile?.job_title || user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-2 text-sm">
                                    {profile?.phone && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">Phone:</span>
                                            <span className="text-gray-700">{profile.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">Email:</span>
                                        <span className="text-gray-700">{user.email}</span>
                                    </div>
                                    {profile?.github_url && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">Github:</span>
                                            <a
                                                href={profile.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-700 hover:text-gray-900 underline"
                                            >
                                                {profile.github_url}
                                            </a>
                                        </div>
                                    )}
                                    {profile?.linkedin_url && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">LinkedIn:</span>
                                            <a
                                                href={profile.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-700 hover:text-gray-900 underline"
                                            >
                                                {profile.linkedin_url}
                                            </a>
                                        </div>
                                    )}
                                    {profile?.portfolio_url && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">Portfolio:</span>
                                            <a
                                                href={profile.portfolio_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-700 hover:text-gray-900 underline"
                                            >
                                                {profile.portfolio_url}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Experience Section */}
                                {workExperiences.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                                            Experience
                                        </h2>
                                        <div className="space-y-5">
                                            {workExperiences.map((exp) => (
                                                <div key={exp.id}>
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-base">
                                                                {exp.job_title} at {exp.company}
                                                            </h3>
                                                        </div>
                                                        <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                                                            {formatDateRange(exp.start_date, exp.end_date)}
                                                        </span>
                                                    </div>
                                                    {exp.description && (
                                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2 ml-2">
                                                            {exp.description.split('\n').filter(Boolean).map((item, idx) => (
                                                                <li key={idx} className="leading-relaxed">
                                                                    {item.trim()}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {exp.achievements && (
                                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2 ml-2">
                                                            {exp.achievements.split('\n').filter(Boolean).map((item, idx) => (
                                                                <li key={idx} className="leading-relaxed">
                                                                    {item.trim()}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Featured Projects Section */}
                                {projects.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                                            Featured Projects
                                        </h2>
                                        <div className="space-y-5">
                                            {projects.map((project) => (
                                                <div key={project.id}>
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-base">
                                                                {project.name}
                                                            </h3>
                                                            {project.role && (
                                                                <p className="text-sm text-gray-600 font-normal mt-0.5">
                                                                    Role: {project.role}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {project.technologies && (
                                                        <div className="mb-2 mt-2">
                                                            <p className="text-xs font-semibold text-gray-700 mb-1">
                                                                Technologies:
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                {project.technologies}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {project.description && (
                                                        <div className="mb-2 mt-2">
                                                            <p className="text-xs font-semibold text-gray-700 mb-1">
                                                                Features:
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                                                                {project.description.split('\n').filter(Boolean).map((item, idx) => (
                                                                    <li key={idx} className="leading-relaxed">
                                                                        {item.trim()}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {project.live_link && (
                                                        <div className="mt-2">
                                                            <a
                                                                href={project.live_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-gray-700 hover:text-gray-900 underline"
                                                            >
                                                                Live Link: {project.live_link}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
