import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { User, College, Application, PaymentTransaction, Course } from '../types';
import { EXCHANGE_RATES, formatCurrency } from '../utils/currency';
import { sendPaymentData } from '../utils/sheetsApi';
import DocumentUploader from '../src/components/DocumentUploader';

interface AdmissionFormPageProps {
  user: User;
  onAddApplication: (applicationData: Omit<Application, 'id' | 'status' | 'submittedDate' | 'appointmentDetails' | 'leadScore' | 'assignedTo' | 'communicationHistory'>) => Application;
  onAddPaymentTransaction: (transactionData: Omit<PaymentTransaction, 'paymentId'>) => void;
  colleges: College[];
}

const AdmissionFormPage: React.FC<AdmissionFormPageProps> = ({ user, onAddApplication, onAddPaymentTransaction, colleges }) => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const college = colleges.find(c => c.id === collegeId);

  const preselectedCourseId = location.state?.selectedCourseId;

  const [isSubmittingWithPayment, setIsSubmittingWithPayment] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const [formData, setFormData] = useState({
    course: preselectedCourseId || college?.courses[0]?.id || '',
    contactNumber: user.phone || '',
  });

  const [documentUrls, setDocumentUrls] = useState({
    cert10th: '',
    cert12th: '',
  });

  if (!college) {
    return <div>College not found.</div>;
  }
  
  const selectedCourse = college.courses.find(c => c.id === formData.course);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocumentUpload = (docKey: 'cert10th' | 'cert12th', url: string) => {
    setDocumentUrls(prev => ({ ...prev, [docKey]: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCourse: Course | undefined = college.courses.find(c => c.id === formData.course);
    if (!selectedCourse) {
        alert("Please select a valid course.");
        return;
    }
    const newApplicationData = {
      userId: user.id,
      collegeId: college.id,
      collegeName: college.name,
      course: selectedCourse.name,
      applicantName: user.name,
      applicantEmail: user.email,
      contactNumber: formData.contactNumber,
      documentUrls: documentUrls,
    };
    const newApplication = onAddApplication(newApplicationData);

    if (isSubmittingWithPayment && college.upiId && college.admissionFee) {
        const newTransaction: Omit<PaymentTransaction, 'paymentId'> = {
            applicationId: newApplication.id,
            studentId: user.id,
            studentName: user.name,
            collegeId: college.id,
            collegeName: college.name,
            courseName: selectedCourse.name,
            amount: college.admissionFee,
            upiId: college.upiId,
            paymentDate: new Date().toISOString(),
            status: 'Pending',
            verifiedByCollege: 'No',
        };
        onAddPaymentTransaction(newTransaction);
        
        sendPaymentData({
            studentName: newTransaction.studentName,
            studentID: newTransaction.studentId,
            collegeName: newTransaction.collegeName,
            collegeID: newTransaction.collegeId,
            courseName: newTransaction.courseName,
            amount: String(newTransaction.amount),
            UPI_ID: newTransaction.upiId,
            paymentDate: newTransaction.paymentDate,
            paymentStatus: newTransaction.status,
            paymentScreenshotURL: '', 
            verifiedByCollege: newTransaction.verifiedByCollege,
            remarks: 'Application Fee',
        }).catch(error => console.error("Failed to send payment data to sheet:", error));

        const transactionNote = `Admission Fee for ${user.name} - ${selectedCourse.name}`;
        const upiUrl = `upi://pay?pa=${college.upiId}&pn=${encodeURIComponent(college.name)}&am=${college.admissionFee}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        navigate('/payment-status');
        window.location.href = upiUrl;
    } else {
        const confirmationData = {
            admissionId: newApplication.id,
            studentName: user.name,
            collegeName: college.name,
            courseName: selectedCourse.name,
            admissionFee: college.admissionFee || 0,
            submissionDate: newApplication.submittedDate,
        };
        navigate('/confirmation', { state: confirmationData });
    }
    setIsSubmittingWithPayment(false);
  };

  const handlePayAndSubmit = () => {
    setIsSubmittingWithPayment(true);
  };

  const handleRegularSubmit = () => {
    setIsSubmittingWithPayment(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900">Admission Application</h1>
      <p className="mt-2 text-lg text-gray-600">
          You are applying to <span className="font-semibold text-indigo-600">{college.name}</span> for the course: <span className="font-semibold text-indigo-600">{selectedCourse?.name || '...'}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" value={user.name} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" value={user.email} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="tel" name="contactNumber" id="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Course Selection</h2>
          <div className="mt-4">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Select a Course</label>
            <select name="course" id="course" value={formData.course} onChange={handleInputChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {college.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Upload Documents</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <DocumentUploader 
                    label="10th Certificate*" 
                    folderKey="10th_Certificate" 
                    onUploadSuccess={(url) => handleDocumentUpload('cert10th', url)} 
                    id={user.id}
                    fieldName="cert10th"
                 />
                 <DocumentUploader 
                    label="12th Certificate*" 
                    folderKey="12th_Certificate" 
                    onUploadSuccess={(url) => handleDocumentUpload('cert12th', url)} 
                    id={user.id}
                    fieldName="cert12th"
                />
            </div>
        </div>

        {college.admissionFee && (
            <div className="my-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg space-y-3">
                <div>
                  <p className="font-semibold text-indigo-800">One-time Admission Fee:</p>
                  <p className="text-2xl font-bold text-indigo-700">₹{college.admissionFee.toLocaleString()}</p>
                </div>
                <div className="pt-3 border-t border-indigo-200">
                    <label htmlFor="currency-converter" className="text-sm font-medium text-indigo-800">
                        View in another currency:
                    </label>
                    <div className="mt-1 flex items-center gap-3">
                         <select 
                            id="currency-converter"
                            value={selectedCurrency}
                            onChange={e => setSelectedCurrency(e.target.value)}
                            className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {Object.keys(EXCHANGE_RATES).map(code => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                        <p className="text-lg font-semibold text-indigo-700">
                            {formatCurrency(college.admissionFee, selectedCurrency, EXCHANGE_RATES[selectedCurrency])}
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="pt-5">
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => navigate(-1)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                {(!college.admissionFee) ? (
                    <button
                        type="submit"
                        onClick={handleRegularSubmit}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Submit Application
                    </button>
                ) : college.upiId ? (
                    <button
                        type="submit"
                        onClick={handlePayAndSubmit}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Pay Admission Fee & Submit
                    </button>
                ) : (
                    <button
                        type="submit"
                        onClick={handleRegularSubmit}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Submit Application (Pay fee later)
                    </button>
                )}
            </div>
        </div>
      </form>
    </div>
  );
};

export default AdmissionFormPage;