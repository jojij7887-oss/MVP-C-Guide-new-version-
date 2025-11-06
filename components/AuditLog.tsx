import React from 'react';
import { ClipboardDocumentCheckIcon } from './icons';

export interface AuditLogEntry {
    timestamp: Date;
    description: string;
}

interface AuditLogProps {
    logs: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="h-7 w-7 text-gray-500" />
                Audit Log
            </h2>
            <p className="mt-1 text-gray-600">A record of recent changes made to this profile.</p>

            <div className="mt-6 border-t border-gray-200">
                {logs.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {logs.slice(0, 5).map((log, index) => ( // Show latest 5
                            <li key={index} className="py-4">
                                <div className="flex space-x-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">{log.description}</h3>
                                            <p className="text-sm text-gray-500">{log.timestamp.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No changes have been logged yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLog;