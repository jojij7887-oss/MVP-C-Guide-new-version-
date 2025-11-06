import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ProfileIcon, TravelIcon, LoanIcon, AdsIcon, StarIcon, ClipboardListIcon, BriefcaseIcon, WalletIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/icons';
import { College } from '../types';

const DashboardCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
  <Link to={to} className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
  </Link>
);


const DashboardPage: React.FC<{ colleges: College[] }> = ({ colleges }) => {
  const features = [
    { to: '/search', icon: <SearchIcon className="h-8 w-8" />, title: 'Search Colleges', description: 'Find the perfect college by name, location, or course.' },
    { to: '/favorites', icon: <StarIcon className="h-8 w-8" />, title: 'My Favorites', description: 'Access your saved colleges and courses.' },
    { to: '/status', icon: <ClipboardListIcon className="h-8 w-8" />, title: 'Admission Status', description: 'Track the status of your applications.' },
    { to: '/career-hub', icon: <BriefcaseIcon className="h-8 w-8" />, title: 'Career Hub', description: 'Explore career paths and recommended courses. Coming Soon!' },
    { to: '/wallet', icon: <WalletIcon className="h-8 w-8" />, title: 'My Wallet', description: 'Manage your application fees and payments.' },
    { to: '/community-forum', icon: <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />, title: 'Community Forum', description: 'Connect with peers and ask questions.' },
    { to: '/profile', icon: <ProfileIcon className="h-8 w-8" />, title: 'My Profile', description: 'View and update your personal information.' },
    { to: '/travel', icon: <TravelIcon className="h-8 w-8" />, title: 'Travel Booking', description: 'Arrange travel to your college campus. Coming Soon!' },
    { to: '/loans', icon: <LoanIcon className="h-8 w-8" />, title: 'Education Loan Info', description: 'Explore loan options to fund your education. Coming Soon!' },
    { to: '/ads', icon: <AdsIcon className="h-8 w-8" />, title: 'All Promotions', description: 'See all featured colleges and special announcements. Coming Soon!' },
  ];
  

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Your Future, Your Choice!</h1>
        <p className="mt-2 text-lg text-gray-600">Everything you need in one place.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <DashboardCard key={feature.to} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;