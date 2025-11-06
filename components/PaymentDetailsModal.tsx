import React from 'react';
import { Application, PaymentTransaction } from '../types';
import { CheckCircleIcon, ClockIcon, XCircleIcon, XMarkIcon } from '../components/icons';

interface PaymentDetailsModalProps {
    app: Application;
    payment: PaymentTransaction;
    onClose: () => void;
    onConfirmPayment: (transaction: PaymentTransaction, remarks: string) => void;
    onMessageStudent: (applicationId: string) => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value}</p>
    </div>
);

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ app, payment, onClose, onConfirmPayment, onMessageStudent }) => {
    const isPending = payment.status === 'Pending';
    
    const statusInfo = {
        Pending: { text: 'Pending', color: 'text-yellow-600', icon: <ClockIcon className="h-5 w-5" /> },
        Confirmed: { text: 'Paid', color: 'text-green-600', icon: <CheckCircleIcon className="h-5 w-5" /> },
        Failed: { text: 'Failed', color: 'text-red-600', icon: <XCircleIcon className="h-5 w-5" /> },
    }[payment.status];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-95 animate-fade-in-up">
                <header className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-xl font-bold">Student Admission & Payment Details</h2>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student & Course Info */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-lg border-b pb-2">Applicant Information</h3>
                            <DetailRow label="Student Name" value={app.applicantName} />
                            <DetailRow label="Student Email" value={app.applicantEmail} />
                            <DetailRow label="Course Name" value={app.course} />
                        </div>
                        {/* Payment Info */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-lg border-b pb-2">Payment Information</h3>
                            <DetailRow label="Admission Fee" value={`₹${payment.amount.toLocaleString()}`} />
                            <DetailRow label="UPI ID Used" value={payment.upiId} />
                            <DetailRow label="Transaction ID" value={<span className="font-mono text-sm">{payment.paymentId}</span>} />
                            <DetailRow label="Transaction Date" value={new Date(payment.paymentDate).toLocaleString()} />
                            <DetailRow 
                                label="Status" 
                                value={
                                    <div className={`flex items-center gap-2 font-semibold ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.text}</span>
                                    </div>
                                } 
                            />
                        </div>
                    </div>
                </main>
                <footer className="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-end items-center gap-3">
                    <button onClick={onClose} className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Back to Admissions</button>
                    <button onClick={() => onMessageStudent(app.id)} className="w-full sm:w-auto bg-blue-100 text-blue-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-200">Message Student</button>
                    {isPending && (
                        <button onClick={() => onConfirmPayment(payment, 'Verified via Admissions dashboard.')} className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700">Verify Payment</button>
                    )}
                </footer>
            </div>
            {/* Add some simple animation classes to tailwind config if not present, or just inline style for now */}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PaymentDetailsModal;