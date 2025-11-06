import React from 'react';
import { College } from '../types';
import { XMarkIcon } from './icons';

interface CollegePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: College | null;
}

const CollegePreviewModal: React.FC<CollegePreviewModalProps> = ({ isOpen, onClose, college }) => {
  if (!isOpen || !college) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white w-full max-w-2xl max-h-[90vh] rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 border-b relative">
          <h2 className="text-lg font-semibold text-center text-gray-800">College Preview</h2>
          <button
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-800"
            aria-label="Close preview"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Banner & Logo Section */}
          <div className="relative mb-16">
            <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={college.photoUrl}
                alt={`${college.name} Banner`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <img
                src={college.logoUrl}
                alt={`${college.name} Logo`}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* College Name & Location */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-md text-gray-500">{college.location}</p>
          </div>

          <div className="my-6 border-t"></div>

          {/* Courses Offered */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Courses Offered</h3>
            <div className="flex flex-wrap gap-2">
              {college.courses.slice(0, 4).map(course => (
                <span key={course.id} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {course.name}
                </span>
              ))}
               {college.courses.length > 4 && (
                 <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  +{college.courses.length - 4} more
                </span>
              )}
            </div>
          </section>

          {/* Event Gallery with "Coming Soon" placeholder */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Gallery</h3>
            <div className="h-32 w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 shadow-inner">
              <p className="text-lg font-bold text-white">
                🎉 Coming Soon
              </p>
            </div>
          </section>
        </div>

        <div className="p-4 bg-gray-50 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegePreviewModal;
