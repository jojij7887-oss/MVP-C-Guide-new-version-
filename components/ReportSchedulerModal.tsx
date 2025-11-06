import React, { useState } from 'react';
import { XMarkIcon } from './icons';

interface ReportSchedulerModalProps {
    onClose: () => void;
}

const ReportSchedulerModal: React.FC<ReportSchedulerModalProps> = ({ onClose }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Report scheduled successfully! (Simulated)');
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Schedule a Report</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div>
                            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
                            <select id="reportType" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Admissions Summary</option>
                                <option>Lead Conversion Funnel</option>
                                <option>Full Analytics Dashboard</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                            <select id="frequency" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Recipient Email</label>
                            <input type="email" id="email" required defaultValue="e.reed@apex.edu" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </main>
                    <footer className="px-6 py-3 bg-gray-50 text-right">
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">
                            Schedule
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ReportSchedulerModal;
