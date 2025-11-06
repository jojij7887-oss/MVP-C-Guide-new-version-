import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { User, Notification, College } from '../types';

interface AdminLayoutProps {
    user: User;
    college: College;
    notifications: Notification[];
    onMarkNotificationAsRead: (id: string) => void;
    onMarkAllNotificationsAsRead: () => void;
    onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, college, notifications, onMarkNotificationAsRead, onMarkAllNotificationsAsRead, onLogout }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader 
                user={user} 
                college={college}
                notifications={notifications}
                onMarkNotificationAsRead={onMarkNotificationAsRead}
                onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
                onLogout={onLogout}
            />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;