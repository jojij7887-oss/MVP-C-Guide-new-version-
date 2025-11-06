import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Application } from '../types';
import { CheckCircleIcon, ClockIcon, XCircleIcon, CalendarDaysIcon } from '../components/icons';

interface AdmissionStatusPageProps {
    applications: Application[];
}

// Map internal status to UI display properties
const statusDisplayInfo: { [key in Application['status']]: { label: string; icon: React.ReactNode; color: string; borderColor: string; } } = {
    Pending: {
        label: 'Pending',
        icon: <ClockIcon className="h-6 w-6 text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800',
        borderColor: 'border-yellow-500'
    },
    Verified: {
        label: 'Verification',
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-500" />,
        color: 'bg-blue-100 text-blue-800',
        borderColor: 'border-blue-500'
    },
    'Appointment Scheduled': {
        label: 'Scheduled',
        icon: <CalendarDaysIcon className="h-6 w-6 text-purple-500" />,
        color: 'bg-purple-100 text-purple-800',
        borderColor: 'border-purple-500'
    },
    Confirmed: {
        label: 'Confirmed',
        icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        color: 'bg-green-100 text-green-800',
        borderColor: 'border-green-500'
    },
    Rejected: {
        label: 'Rejected',
        icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
        color: 'bg-red-100 text-red-800',
        borderColor: 'border-red-500'
    },
};

const StudentAdmissionStatus: React.FC<AdmissionStatusPageProps> = ({ applications }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admission Status</h1>
                <p className="mt-2 text-lg text-gray-600">Track your college applications and communicate with admission offices.</p>
            </div>
            
            {applications.length > 0 ? (
                <div className="space-y-6">
                    {applications.map(app => {
                        const display = statusDisplayInfo[app.status];
                        return (
                            <div key={app.id} className={`p-6 bg-white rounded-lg shadow-md border-l-4 ${display.borderColor}`}>
                               <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                                 <div className="flex-grow mb-4 sm:mb-0">
                                     <h2 
                                         onClick={() => navigate(`/college/${app.collegeId}`)}
                                         className="text-xl font-bold text-indigo-600 cursor-pointer hover:underline"
                                         aria-label={`View profile for ${app.collegeName}`}
                                     >
                                         {app.collegeName}
                                     </h2>
                                     <p className="text-gray-600">Course: {app.course}</p>
                                     <p className="text-sm text-gray-500 mt-1">Submitted: {new Date(app.submittedDate).toLocaleDateString()}</p>
                                 </div>
                                 <div className="flex items-center space-x-3 w-full sm:w-auto">
                                     {display.icon}
                                     <span className={`w-full sm:w-auto text-center px-3 py-1 inline-flex text-sm font-semibold rounded-full ${display.color}`}>
                                         {display.label}
                                     </span>
                                 </div>
                               </div>

                               {app.status === 'Appointment Scheduled' && app.appointmentDetails && (
                                    <div className="mt-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                                        <p className="font-semibold text-purple-800">Appointment Details:</p>
                                        <p className="text-sm text-purple-700">
                                            <strong>Date:</strong> {app.appointmentDetails.date}, <strong>Time:</strong> {app.appointmentDetails.time}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/chat/${app.id}`)}
                                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        View Details & Chat
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500">You haven't submitted any applications yet.</p>
                     <a href="#/search" className="mt-6 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                        Find a College to Apply
                    </a>
                </div>
            )}
        </div>
    );
};

export default StudentAdmissionStatus;