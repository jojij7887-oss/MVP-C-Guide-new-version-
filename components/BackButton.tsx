import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from './icons';

interface BackButtonProps {
  /** Optional custom handler for the back action. */
  onBack?: () => void;
  /** Optional additional CSS classes. */
  className?: string;
}

/**
 * A styled button component that navigates to the previous page.
 * It uses react-router's `useNavigate` hook for SPA-friendly navigation.
 * A custom `onBack` handler can be provided as a prop.
 */
const BackButton: React.FC<BackButtonProps> = ({ onBack, className }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // `navigate(-1)` is the programmatic equivalent of clicking the browser's back button.
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className || ''}`}
      aria-label="Go back"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;