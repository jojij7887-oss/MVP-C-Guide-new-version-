import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Application, User, PaymentTransaction, College } from '../../types';
import BackButton from '../../components/BackButton';

interface StudentDetailsPageProps {
    applications: Application[];
    usersData: Record<string, User>;
    paymentTransactions: PaymentTransaction[];
    colleges: College[];
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value}</p>
    </div>
);

const renderDocumentLink = (url: string | undefined, docName: string) => {
    if (!url) {
        return <p className="text-gray-500">Not uploaded.</p>;
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition-colors">View {docName}</a>;
};


const StudentDetailsPage: React.FC<StudentDetailsPageProps> = ({ applications, usersData, paymentTransactions, colleges }) => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const navigate = useNavigate();

    const application = applications.find(app => app.id === applicationId);
    const payment = paymentTransactions.find(p => p.applicationId === applicationId);
    const college = application ? colleges.find(c => c.id === application.collegeId) : null;

    if (!application) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-600">Application Not Found</h2>
                <BackButton className="mt-4" />
            </div>
        );
    }

    const paymentStatus = payment && payment.status === 'Confirmed' ? 'Paid' : 'Not Paid';
    const admissionFee = payment ? payment.amount : college?.admissionFee;
    const paymentStatusColor = paymentStatus === 'Paid' ? 'text-purple-700' : 'text-yellow-700';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                 <BackButton />
                 <button
                    onClick={() => navigate(`/admin/admissions`)}
                    className="bg-indigo-100 text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-200"
                >
                    Back to Admissions
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <header className="bg-indigo-600 text-white -m-8 mb-8 p-6 rounded-t-lg">
                    <h1 className="text-2xl font-bold">Student Admission Details</h1>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Applicant Information</h2>
                        <DetailRow label="Student Name" value={application.applicantName} />
                        <DetailRow label="Email" value={application.applicantEmail} />
                        <DetailRow label="Course Name" value={application.course} />
                        <DetailRow label="Applied Date" value={new Date(application.submittedDate).toLocaleDateString()} />
                        
                        <div className="pt-6 border-t mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                            <DetailRow 
                                label="Payment Status" 
                                value={
                                    <span className={`font-semibold ${paymentStatusColor}`}>
                                        {paymentStatus}
                                    </span>
                                } 
                            />
                            <DetailRow 
                                label="Admission Fee" 
                                value={admissionFee ? `₹${admissionFee.toLocaleString()}` : 'N/A'} 
                            />
                        </div>
                    </div>

                    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Uploaded Documents</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">10th Certificate</h3>
                                {renderDocumentLink(application.documentUrls.cert10th, '10th Certificate')}
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">12th Certificate</h3>
                                {renderDocumentLink(application.documentUrls.cert12th, '12th Certificate')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsPage;
