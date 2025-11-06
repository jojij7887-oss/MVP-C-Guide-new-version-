import React from 'react';
import { Link } from 'react-router-dom';
import { LoanIcon } from '../components/icons';

const LoanInfoPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-6">
        <LoanIcon className="h-12 w-12 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Education Loan Info</h1>
      <p className="mt-4 text-xl text-gray-500">
        Feature Coming Soon! 💰
      </p>
      <p className="mt-2 text-gray-500">
        We are gathering information from top loan providers to help you fund your education.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default LoanInfoPage;