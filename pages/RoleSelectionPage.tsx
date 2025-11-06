import React from 'react';

interface RoleSelectionPageProps {
  onSelectRole: (role: 'STUDENT' | 'COLLEGE_ADMIN') => void;
}

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Role Selection Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">C Guide</h1>
        <p className="text-gray-600 mb-6">
          Choose your role to continue
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onSelectRole('STUDENT')}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Continue as Student
          </button>
          <button
            onClick={() => onSelectRole('COLLEGE_ADMIN')}
            className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Continue as College Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
