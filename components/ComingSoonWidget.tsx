import React from 'react';
import { SparklesIcon } from './icons';

interface ComingSoonWidgetProps {
  onReturn: () => void;
}

const ComingSoonWidget: React.FC<ComingSoonWidgetProps> = ({ onReturn }) => {
  return (
    <div className="w-full max-w-lg text-center bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
        <SparklesIcon className="h-9 w-9 text-indigo-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Feature Coming Soon!</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">
        We’re currently building this section. You’ll soon be able to explore it here.
      </p>
      <button
        onClick={onReturn}
        className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default ComingSoonWidget;
