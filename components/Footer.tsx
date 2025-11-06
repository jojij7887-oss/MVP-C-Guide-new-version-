
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} C Guide. All Rights Reserved.</p>
        <div className="mt-2">
          <a href="#" className="text-sm text-indigo-600 hover:underline mx-2">Privacy Policy</a>
          <span className="text-gray-400">|</span>
          <a href="#" className="text-sm text-indigo-600 hover:underline mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
