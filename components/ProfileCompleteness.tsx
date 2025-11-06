
import React, { useMemo } from 'react';
import { College } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ProfileCompletenessProps {
    college: College;
}

const completenessCriteria = [
    { key: 'name', weight: 10, label: 'College Name is set', test: (c: College) => !!c.name },
    { key: 'location', weight: 10, label: 'Location is set', test: (c: College) => !!c.location },
    { key: 'phone', weight: 10, label: 'Phone Number is added', test: (c: College) => !!c.phone },
    { key: 'photoUrl', weight: 15, label: 'Banner Image is added', test: (c: College) => !!c.photoUrl },
    { key: 'logoUrl', weight: 15, label: 'Logo is added', test: (c: College) => !!c.logoUrl },
    { key: 'description', weight: 15, label: 'Full Description (150+ chars)', test: (c: College) => c.description.length > 150 },
    { key: 'shortDescription', weight: 5, label: 'Short Description (50+ chars)', test: (c: College) => c.shortDescription.length > 50 },
    { key: 'courses', weight: 10, label: 'At least 3 courses', test: (c: College) => c.courses.length >= 3 },
    { key: 'events', weight: 10, label: 'At least 2 events', test: (c: College) => c.events.length >= 2 },
];

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ college }) => {
    const { score, completedChecks, incompleteChecks } = useMemo(() => {
        let currentScore = 0;
        const completed: typeof completenessCriteria = [];
        const incomplete: typeof completenessCriteria = [];

        completenessCriteria.forEach(check => {
            if (check.test(college)) {
                currentScore += check.weight;
                completed.push(check);
            } else {
                incomplete.push(check);
            }
        });
        return { score: currentScore, completedChecks: completed, incompleteChecks: incomplete };
    }, [college]);

    const progressColor = score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Profile Completeness</h2>
            <div className="mt-3 flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className={`h-4 rounded-full transition-all duration-500 ${progressColor}`} 
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
                <span className={`font-bold text-lg ${score > 80 ? 'text-green-600' : score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</span>
            </div>
            
            <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">How to improve:</h3>
                {incompleteChecks.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                        {incompleteChecks.slice(0, 3).map(check => (
                             <li key={check.key} className="flex items-center gap-2">
                                <XCircleIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
                                <span>{check.label}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-sm text-green-700 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5"/>
                        Your profile is complete. Great job!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileCompleteness;