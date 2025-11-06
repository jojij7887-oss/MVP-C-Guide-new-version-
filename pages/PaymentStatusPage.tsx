import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon } from '../components/icons';

const PaymentStatusPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-lg">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
        <ClockIcon className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Sent — Awaiting Verification</h1>
      <p className="mt-2 text-lg text-gray-600">Your UPI payment has been initiated. The college will verify the payment and update your application status shortly.</p>
      <p className="mt-4 text-sm text-gray-500">You will receive a notification once the payment is confirmed. You can track the status in your wallet and on the admission status page.</p>
      
      <div className="mt-8 flex justify-center space-x-4">
        <Link to="/status" className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Check Application Status
        </Link>
        <Link to="/dashboard" className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
