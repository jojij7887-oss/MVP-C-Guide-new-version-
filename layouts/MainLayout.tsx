import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User } from '../types';

interface MainLayoutProps {
  user: User;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onMarkNotificationAsRead, onMarkAllNotificationsAsRead, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onMarkNotificationAsRead={onMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead} 
        onLogout={onLogout}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;