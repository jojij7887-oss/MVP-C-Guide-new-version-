import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User, Notification, College } from '../types';
import { BellIcon, LogoutIcon } from './icons';
import CollegePreviewModal from './CollegePreviewModal';

interface AdminHeaderProps {
  user: User;
  college: College;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, college, notifications, onMarkNotificationAsRead, onMarkAllNotificationsAsRead, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categorizedNotifications = useMemo(() => {
    return notifications.reduce((acc: Record<string, Notification[]>, notification) => {
        const type = notification.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(notification);
        return acc;
    }, {});
  }, [notifications]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75'
    }`;
    
  return (
    <>
    <header className="bg-indigo-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/admin" className="text-xl font-bold text-white">
              C Guide Admin
            </NavLink>
            <nav className="hidden md:flex space-x-4">
                <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/admin/admissions" className={navLinkClass}>Admissions</NavLink>
                <NavLink to="/admin/students" className={navLinkClass}>Students</NavLink>
                <NavLink to="/admin/chat" className={navLinkClass}>Chat</NavLink>
                <NavLink to="/admin/payments" className={navLinkClass}>Payments</NavLink>
                <NavLink to="/admin/manage-profile" className={navLinkClass}>Profile</NavLink>
                <NavLink to="/admin/manage-courses" className={navLinkClass}>Courses</NavLink>
                <NavLink to="/admin/manage-events" className={navLinkClass}>Events</NavLink>
                <NavLink to="/admin/manage-ads" className={navLinkClass}>Featured Ads</NavLink>
                <NavLink to="/admin/manage-college-ads" className={navLinkClass}>College Ads</NavLink>
                <NavLink to="/admin/analytics" className={navLinkClass}>Analytics</NavLink>
            </nav>
          </div>
          <div className="flex items-center text-white space-x-4">
             <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative text-indigo-100 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    title="Notifications"
                >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unreadCount}</span>
                    )}
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg overflow-hidden z-20 border text-gray-800">
                        <div className="p-3 flex justify-between items-center border-b">
                           <h3 className="font-semibold">Notifications</h3>
                           {unreadCount > 0 && <button onClick={onMarkAllNotificationsAsRead} className="text-sm text-indigo-600 hover:underline">Mark all as read</button>}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {Object.entries(categorizedNotifications).map(([type, notifs]) => (
                                <div key={type}>
                                    <h4 className="px-3 py-2 bg-gray-50 text-sm font-bold text-gray-600 uppercase tracking-wider">{type === 'application' ? 'New Applications' : type === 'student' ? 'Student Messages' : type === 'payment' ? 'Payment Updates' : 'System Messages'}</h4>
                                    <ul>
                                        {notifs.map(n => (
                                            <li key={n.id} onClick={() => onMarkNotificationAsRead(n.id)} className={`border-b hover:bg-gray-100 ${!n.isRead ? 'bg-indigo-50' : ''}`}>
                                                <Link to={n.link || '#'} className="block p-3">
                                                    <div className="flex items-start">
                                                        {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>}
                                                        <div className="flex-grow">
                                                            <p className={`font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                                                            <p className="text-sm text-gray-600">{n.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                             {notifications.length === 0 && <p className="p-4 text-sm text-center text-gray-500">No notifications yet.</p>}
                        </div>
                    </div>
                )}
             </div>

             <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center space-x-2 text-indigo-100 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                  title="Preview College Profile"
                >
                    {user.profilePhotoUrl ? (
                        <img src={user.profilePhotoUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-white font-bold">{user.name.charAt(0)}</span>
                        </div>
                    )}
                </button>
                <span className="hidden sm:inline">{user.name}</span>
            </div>
             <button
                onClick={onLogout}
                title="Exit to Role Selection"
                className="text-indigo-100 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            >
                <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
    <CollegePreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        college={college}
    />
    </>
  );
};
export default AdminHeader;