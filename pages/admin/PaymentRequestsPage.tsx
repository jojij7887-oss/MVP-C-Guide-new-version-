
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentTransaction, Application } from '../../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '../../components/icons';

interface PaymentRequestsPageProps {
  transactions: PaymentTransaction[];
  applications: Application[];
}

const statusStyles: Record<PaymentTransaction['status'], { bg: string; text: string; ring: string; icon: React.ReactNode }> = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-600/20', icon: <ClockIcon className="h-5 w-5" /> },
    Confirmed: { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-600/20', icon: <CheckCircleIcon className="h-5 w-5" /> },
    Failed: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-600/20', icon: <XCircleIcon className="h-5 w-5" /> },
};

const PaymentRequestsPage: React.FC<PaymentRequestsPageProps> = ({ transactions, applications }) => {
    const [filter, setFilter] = useState<PaymentTransaction['status'] | 'All'>('All');
    const navigate = useNavigate();

    const filteredTransactions = useMemo(() => {
        if (filter === 'All') return transactions;
        return transactions.filter(t => t.status === filter);
    }, [transactions, filter]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment Requests</h1>
            <p className="text-gray-600">Review and verify student admission fee payments made via UPI.</p>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map(t => {
                            const statusInfo = statusStyles[t.status];
                            return (
                            <tr key={t.paymentId}>
                                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{t.studentName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{t.courseName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">₹{t.amount.toLocaleString()}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.paymentDate).toLocaleDateString()}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                                        {statusInfo.icon}
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/admin/payments/${t.applicationId}`)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Details &amp; Schedule
                                    </button>
                                </td>
                            </tr>
                        )})}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    No payment requests found for the selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentRequestsPage;