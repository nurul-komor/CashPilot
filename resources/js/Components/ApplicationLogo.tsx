import { Wallet } from 'lucide-react';

interface ApplicationLogoProps {
    className?: string;
}

export default function ApplicationLogo({ className = '' }: ApplicationLogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FinGenie
            </span>
        </div>
    );
}
