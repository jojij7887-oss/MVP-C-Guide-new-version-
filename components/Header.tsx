import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Notification, NotificationType } from '../types';
import { ProfileIcon, BellIcon, LogoutIcon } from './icons';

interface HeaderProps {
  user: User | null;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onLogout: () => void;
}

const notificationCategoryMap: Record<NotificationType, string> = {
    'status': 'Admission Status Updates',
    'message': 'Messages',
    'offer': 'Offers & Promotions',
    'admission': 'Admission Dates',
    'update': 'New Updates',
    // Default/Admin types - map them to a generic category for student view if they appear
    'application': 'System Updates',
    'student': 'Messages',
    'system': 'System Updates',
    'payment': 'Payment Updates'
};

const Header: React.FC<HeaderProps> = ({ user, onMarkNotificationAsRead, onMarkAllNotificationsAsRead, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => user?.notifications.filter(n => !n.isRead).length || 0, [user]);

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
    if (!user) return {};
    return user.notifications.reduce((acc: Record<string, Notification[]>, notification) => {
        const category = notificationCategoryMap[notification.type] || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(notification);
        return acc;
    }, {});
  }, [user]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
        onMarkNotificationAsRead(notification.id);
    }
    if (notification.link) {
        navigate(notification.link);
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              C Guide
            </Link>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden sm:block">Welcome, {user.name}</span>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-500 hover:text-indigo-600 relative" title="Notifications">
                        <BellIcon className="h-6 w-6"/>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unreadCount}</span>
                        )}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-20 border">
                           <div className="p-3 flex justify-between items-center border-b">
                               <h3 className="font-semibold text-gray-800">Notifications</h3>
                               {unreadCount > 0 && <button onClick={onMarkAllNotificationsAsRead} className="text-sm text-indigo-600 hover:underline">Mark all as read</button>}
                           </div>
                            <div className="max-h-96 overflow-y-auto">
                                {user.notifications.length > 0 ? (
                                     Object.entries(categorizedNotifications).map(([category, notifs]) => (
                                        <div key={category}>
                                            <h4 className="px-4 py-2 bg-gray-50 text-sm font-bold text-gray-600 uppercase tracking-wider">{category}</h4>
                                            <ul>
                                                {notifs.map(n => (
                                                    <li key={n.id} onClick={() => handleNotificationClick(n)} className={`border-b hover:bg-gray-100 cursor-pointer ${!n.isRead ? 'bg-indigo-50' : ''}`}>
                                                        <div className="p-4">
                                                            <div className="flex items-start">
                                                                {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>}
                                                                <div className="flex-grow">
                                                                    <p className={`font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                                                                    <p className="text-sm text-gray-600">{n.message}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p className="px-4 py-8 text-sm text-center text-gray-500">No new notifications.</p>
                                )}
                           </div>
                        </div>
                    )}
                </div>
                <Link to="/profile" title="My Profile">
                   {user.profilePhotoUrl ? (
                      <img src={user.profilePhotoUrl} alt="Profile" className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-indigo-400 transition-colors" />
                  ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-400 transition-colors">
                          <ProfileIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                  )}
                </Link>
                <button
                  onClick={onLogout}
                  title="Exit to Role Selection"
                  className="text-gray-500 hover:text-indigo-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogoutIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;