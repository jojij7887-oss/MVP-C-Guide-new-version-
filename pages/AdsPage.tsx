import React from 'react';
import { Link } from "react-router-dom";
import { College } from '../types';
import { AdsIcon } from '../components/icons';

interface AdsPageProps {
  colleges: College[];
}

const AdsPage: React.FC<AdsPageProps> = ({ colleges }) => {
 return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-6">
        <AdsIcon className="h-12 w-12 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">All Promotions</h1>
      <p className="mt-4 text-xl text-gray-500">
        Feature Coming Soon! 📣
      </p>
      <p className="mt-2 text-gray-500">
        A new and improved section for all featured promotions is on its way. Stay tuned!
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

export default AdsPage;