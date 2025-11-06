
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Application, PaymentTransaction, College } from '../../types';
import BackButton from '../../components/BackButton';
import { CheckCircleIcon, ClockIcon } from '../../components/icons';

interface PaymentRequestDetailsPageProps {
    applications: Application[];
    paymentTransactions: PaymentTransaction[];
    onUpdateApplications: (apps: Application[]) => void;
    colleges: College[];
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value || 'N/A'}</p>
    </div>
);

const renderDocumentLink = (url: string | undefined, docName: string) => {
    if (!url) {
        return <p className="text-gray-500">Not uploaded.</p>;
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition-colors">View {docName}</a>;
};


const PaymentRequestDetailsPage: React.FC<PaymentRequestDetailsPageProps> = ({ applications, paymentTransactions, onUpdateApplications, colleges }) => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const navigate = useNavigate();

    const application = applications.find(app => app.id === applicationId);
    const payment = paymentTransactions.find(p => p.applicationId === applicationId);
    const college = application ? colleges.find(c => c.id === application.collegeId) : null;
    
    const [scheduleDate, setScheduleDate] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!application) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-600">Application Not Found</h2>
                <BackButton className="mt-4" />
            </div>
        );
    }

    const handleConfirmSchedule = () => {
        if (!scheduleDate) {
            alert("Please select an admission date.");
            return;
        }
        
        const updatedApps = applications.map(app => 
            app.id === application.id 
                ? { 
                    ...app, 
                    status: 'Appointment Scheduled' as const, 
                    appointmentDetails: { 
                        date: scheduleDate, 
                        time: '10:00 AM', // Default time
                        location: 'Admissions Office' // Default location
                    } 
                  } 
                : app
        );
        onUpdateApplications(updatedApps);
        setSuccessMessage(`📅 Admission scheduled successfully for ${new Date(scheduleDate).toLocaleDateString()}! The student has been notified.`);
    };

    const paymentStatus = payment?.status === 'Confirmed' ? 'Paid' : 'Pending';
    const paymentStatusInfo = paymentStatus === 'Paid' 
        ? { text: 'Paid', color: 'text-green-800 bg-green-100', icon: <CheckCircleIcon className="h-5 w-5" /> }
        : { text: 'Pending', color: 'text-yellow-800 bg-yellow-100', icon: <ClockIcon className="h-5 w-5" /> };
    
    const today = new Date().toISOString().split('T')[0];
    const admissionFee = payment ? payment.amount : college?.admissionFee;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <BackButton />
            <div className="bg-white p-8 rounded-lg shadow-md">
                <header className="border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Payment & Application Details</h1>
                    <p className="text-gray-500">Review student details and schedule admission.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Student & Payment Info */}
                    <div className="space-y-6">
                        <DetailRow label="Student Name" value={application.applicantName} />
                        <DetailRow label="Email" value={application.applicantEmail} />
                        <DetailRow label="Course Name" value={application.course} />
                        <DetailRow label="Applied Date" value={new Date(application.submittedDate).toLocaleDateString()} />
                        <DetailRow label="Payment Amount" value={admissionFee ? `₹${admissionFee.toLocaleString()}` : 'N/A'} />
                        <DetailRow label="Payment Status" value={
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-semibold rounded-full ${paymentStatusInfo.color}`}>
                                {paymentStatusInfo.icon}
                                {paymentStatusInfo.text}
                            </span>
                        } />
                    </div>

                    {/* Right Column: Documents */}
                    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Uploaded Documents</h3>
                        <div className="space-y-4">
                             <div>
                                <h4 className="text-md font-semibold text-gray-700 mb-2">10th Certificate</h4>
                                {renderDocumentLink(application.documentUrls.cert10th, '10th Certificate')}
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-gray-700 mb-2">12th Certificate</h4>
                                {renderDocumentLink(application.documentUrls.cert12th, '12th Certificate')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Section */}
                <div className="mt-8 pt-6 border-t">
                    <h2 className="text-xl font-semibold text-gray-800">Schedule Admission Date</h2>
                    {!successMessage ? (
                         <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                            <input 
                                type="date"
                                value={scheduleDate}
                                onChange={e => setScheduleDate(e.target.value)}
                                min={today}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button 
                                onClick={handleConfirmSchedule}
                                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                disabled={!scheduleDate}
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 p-4 bg-green-100 text-green-800 font-semibold rounded-lg">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentRequestDetailsPage;
