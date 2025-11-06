import React from 'react';
import { XMarkIcon } from './icons';

interface DrillDownModalProps {
    title: string;
    data: any;
    onClose: () => void;
}

const renderContent = (title: string, data: any) => {
    switch (title) {
        case 'Total Applications':
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.list.map((app: any) => (
                            <tr key={app.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{app.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{app.course}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(app.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        case 'Profile Views (30 days)':
            return (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-center text-gray-600">[Line Chart Placeholder Showing Daily Views]</p>
                    <div className="flex justify-around mt-4 text-sm">
                        {data.labels.map((label: string, index: number) => (
                            <div key={label} className="text-center">
                                <p className="font-bold">{data.data[index].toLocaleString()}</p>
                                <p className="text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'Ad Clicks':
             return (
                <ul className="divide-y divide-gray-200">
                    {data.list.map((ad: any) => (
                        <li key={ad.id} className="py-3 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-800">{ad.title}</span>
                            <span className="text-sm font-semibold text-indigo-600">{ad.clicks.toLocaleString()} clicks</span>
                        </li>
                    ))}
                </ul>
            );
        default:
            return <p>No detailed view available for this metric.</p>;
    }
};

const DrillDownModal: React.FC<DrillDownModalProps> = ({ title, data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {renderContent(title, data)}
                </main>
            </div>
        </div>
    );
};

export default DrillDownModal;
