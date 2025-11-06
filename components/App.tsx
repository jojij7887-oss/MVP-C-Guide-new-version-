
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import RoleSelectionPage from '../pages/RoleSelectionPage';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from './AdminLayout';

// Pages
import DashboardPage from '../pages/DashboardPage';
import SearchPage from '../pages/SearchPage';
import FavoritesPage from '../pages/FavoritesPage';
import AdmissionStatusPage from '../pages/AdmissionStatusPage';
import CollegeProfilePage from '../pages/CollegeProfilePage';
import EventsPage from '../pages/EventsPage';
import AdmissionFormPage from '../pages/AdmissionFormPage';
import ConfirmationPage from '../pages/ConfirmationPage';
import TravelBookingPage from '../pages/TravelBookingPage';
import LoanInfoPage from '../pages/LoanInfoPage';
import AdsPage from '../pages/AdsPage';
import FeaturedAdDetailPage from '../pages/FeaturedAdDetailPage';
import WalletPage from '../pages/WalletPage';
import CareerHubPage from '../pages/CareerHubPage';
import ProfilePage from '../pages/ProfilePage';
import AdmissionChatPage from '../pages/AdmissionChatPage';
import PaymentStatusPage from '../pages/PaymentStatusPage';
import CommunityForumPage from '../pages/CommunityForumPage';
import CreateForumPostPage from '../pages/CreateForumPostPage';
import ForumPostPage from '../pages/ForumPostPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';


// Admin Pages
import CollegeAdminDashboardPage from '../pages/admin/CollegeAdminDashboardPage';
import AdmissionsLeadsPage from '../pages/admin/AdmissionsLeadsPage';
import ManageCollegeProfilePage from '../pages/admin/ManageCollegeProfilePage';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import ManageAdsPage from '../pages/admin/ManageAdsPage';
import ManageCollegeAdsPage from '../pages/admin/ManageCollegeAdsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import AdminChatDashboardPage from '../pages/admin/AdminChatDashboardPage';
import StudentDetailsPage from '../pages/admin/StudentDetailsPage';
import AdminMessagePage from '../pages/admin/AdminMessagesPage';
import PaymentRequestsPage from '../pages/admin/PaymentRequestsPage';
import StudentListPage from '../pages/admin/StudentListPage';
import PaymentRequestDetailsPage from '../pages/admin/PaymentRequestDetailsPage';


// Types & Constants
import { User, College, Application, Course, ChatMessage, Notification, FeaturedAd, CollegeAd, CollegeEvent, PaymentTransaction, ForumPost, ForumReply } from '../types';
import { DUMMY_USER, DUMMY_COLLEGE_ADMIN_USER, COLLEGES, DUMMY_FORUM_POSTS } from '../constants';
import { sendCollegeData, sendAdmissionAdData, sendStudentData, sendAdminData } from '../utils/sheetsApi';

const initialApplications: Application[] = [
  {
    id: 'app-1', userId: 'student-001', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Computer Science', status: 'Pending', submittedDate: new Date('2024-07-20').toISOString(), applicantName: 'Alex Doe', applicantEmail: 'student@cguide.com', contactNumber: '123-456-7890', documentUrls: { cert10th: '10th_certificate_alex.pdf', cert12th: '12th_marksheet_alex.jpg' }, appointmentDetails: null, leadScore: 'Hot', assignedTo: 'John Carter', communicationHistory: [{id: 'ch-1', date: new Date('2024-07-20').toISOString(), action: 'Application Received', notes: 'Initial submission.'}, {id: 'ch-1a', date: new Date('2024-07-22').toISOString(), action: 'Student Message', notes: 'Hello, I wanted to follow up on my application. Could you please provide an update? Thank you!'}]
  },
  {
    id: 'app-2', userId: 'student-002', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Fine Arts', status: 'Appointment Scheduled', submittedDate: new Date('2024-07-18').toISOString(), applicantName: 'Jane Smith', applicantEmail: 'jane.s@example.com', contactNumber: '123-456-7891', documentUrls: {}, appointmentDetails: { date: '2024-08-01', time: '10:00 AM', location: 'Admissions Office, Building A' }, leadScore: 'Warm', assignedTo: 'Emily White', communicationHistory: [{id: 'ch-2', date: new Date('2024-07-22').toISOString(), action: 'Scheduled Interview', notes: 'Student confirmed availability.'}]
  },
  {
    id: 'app-3', userId: 'student-003', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'MBA', status: 'Confirmed', submittedDate: new Date('2024-07-15').toISOString(), applicantName: 'Michael Brown', applicantEmail: 'mike.b@example.com', contactNumber: '123-456-7892', documentUrls: { cert10th: 'transcript.pdf' }, appointmentDetails: null, leadScore: 'Hot', assignedTo: 'John Carter', communicationHistory: []
  },
    {
    id: 'app-4', userId: 'student-004', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Data Science', status: 'Verified', submittedDate: new Date('2024-07-21').toISOString(), applicantName: 'Sarah Wilson', applicantEmail: 's.wilson@example.com', contactNumber: '123-456-7893', documentUrls: { cert10th: 'statement.pdf' }, appointmentDetails: null, leadScore: 'Warm', assignedTo: 'Emily White', communicationHistory: []
  },
  {
    id: 'app-5', userId: 'student-005', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Electrical Engineering', status: 'Rejected', submittedDate: new Date('2024-07-19').toISOString(), applicantName: 'David Lee', applicantEmail: 'd.lee@example.com', contactNumber: '123-456-7894', documentUrls: {}, appointmentDetails: null, leadScore: 'Cold', assignedTo: 'John Carter', communicationHistory: []
  },
  {
    id: 'app-6', userId: 'student-006', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Computer Science', status: 'Pending', submittedDate: new Date('2024-07-22').toISOString(), applicantName: 'Jessica Martinez', applicantEmail: 'jess.m@example.com', contactNumber: '123-456-7895', documentUrls: { cert10th: 'recommendation.pdf' }, appointmentDetails: null, leadScore: null, assignedTo: null, communicationHistory: [{id: 'ch-6a', date: new Date('2024-07-23').toISOString(), action: 'Student Message', notes: 'I have attached my recommendation letter. Please let me know if anything else is needed.'}]
  },
  {
    id: 'app-7', userId: 'student-007', collegeId: 'uni-1', collegeName: 'Apex University of Technology', course: 'Data Science', status: 'Pending', submittedDate: new Date('2024-07-23').toISOString(), applicantName: 'Chris Green', applicantEmail: 'chris.g@example.com', contactNumber: '123-456-7896', documentUrls: {}, appointmentDetails: null, leadScore: null, assignedTo: null, communicationHistory: []
  },
];

const initialChatMessages: ChatMessage[] = [
    { id: 'msg-1', applicationId: 'app-1', sender: 'student', text: 'Hello, I wanted to follow up on my application. Could you please provide an update? Thank you!', timestamp: new Date('2024-07-22T10:30:00Z').toISOString(), read: true },
    { id: 'msg-2', applicationId: 'app-1', sender: 'admin', text: 'Hi Alex, thanks for reaching out. We are currently reviewing your documents and will get back to you by the end of the week.', timestamp: new Date('2024-07-22T11:05:00Z').toISOString(), read: false },
    { id: 'msg-3', applicationId: 'app-1', sender: 'student', text: 'Great, thank you for the quick response!', timestamp: new Date('2024-07-22T11:10:00Z').toISOString(), read: false },
    { id: 'msg-4', applicationId: 'app-6', sender: 'student', text: 'I have attached my recommendation letter. Please let me know if anything else is needed.', timestamp: new Date('2024-07-23T09:00:00Z').toISOString(), read: false },
];

const calculateProfileCompleteness = (college: College): number => {
    const completenessCriteria = [
        { key: 'name', weight: 10, test: (c: College) => !!c.name },
        { key: 'location', weight: 10, test: (c: College) => !!c.location },
        { key: 'photoUrl', weight: 15, test: (c: College) => !!c.photoUrl },
        { key: 'logoUrl', weight: 15, test: (c: College) => !!c.logoUrl },
        { key: 'description', weight: 20, test: (c: College) => c.description.length > 150 },
        { key: 'shortDescription', weight: 10, test: (c: College) => c.shortDescription.length > 50 },
        { key: 'courses', weight: 10, test: (c: College) => c.courses.length >= 3 },
        { key: 'events', weight: 10, test: (c: College) => c.events.length >= 2 },
    ];

    let currentScore = 0;
    completenessCriteria.forEach(check => {
        if (check.test(college)) {
            currentScore += check.weight;
        }
    });
    return currentScore;
};


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [usersData, setUsersData] = useState<Record<string, User>>({
    [DUMMY_USER.id]: DUMMY_USER,
    [DUMMY_COLLEGE_ADMIN_USER.id]: DUMMY_COLLEGE_ADMIN_USER,
  });
  const [colleges, setColleges] = useState<College[]>(COLLEGES);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(DUMMY_FORUM_POSTS);
  
  const handleSelectRole = (role: 'STUDENT' | 'COLLEGE_ADMIN') => {
    if (role === 'STUDENT') {
      setUser(DUMMY_USER);
    } else {
      setUser(DUMMY_COLLEGE_ADMIN_USER);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddApplication = (appData: Omit<Application, 'id' | 'status' | 'submittedDate' | 'appointmentDetails' | 'leadScore' | 'assignedTo' | 'communicationHistory'>) => {
    const newApp: Application = {
        ...appData,
        id: `app-${Date.now()}`,
        status: 'Pending',
        submittedDate: new Date().toISOString(),
        appointmentDetails: null,
        leadScore: null,
        assignedTo: null,
        communicationHistory: [{ id: `ch-${Date.now()}`, date: new Date().toISOString(), action: 'Application Received', notes: 'Initial submission.' }],
    };

    // Add new application to the central list
    setApplications(prev => [...prev, newApp]);

    // Sync with Google Sheets - Admission Ad Data
    sendAdmissionAdData({
      collegeID: newApp.collegeId,
      type: 'Admission',
      title: `Application for ${newApp.course}`,
      description: `New application from ${newApp.applicantName}`,
      mediaURL: user?.profilePhotoUrl || '',
      targetLink: `/#/college/${newApp.collegeId}`,
      startDate: newApp.submittedDate,
      status: newApp.status,
    }).catch(error => console.error("Failed to send admission data to sheet:", error));

    // Update relevant users (student who applied and college admin)
    setUsersData(prevUsers => {
        const updatedUsers = { ...prevUsers };

        // 1. Update the student's application list
        const studentUser = updatedUsers[newApp.userId];
        if (studentUser) {
            studentUser.applications = [...studentUser.applications, newApp];
            // If the currently logged-in user is the student, update the main user state too
            if (user && user.id === studentUser.id) {
                setUser({ ...studentUser });
            }

            // Sync with Google Sheets - Student Data
            sendStudentData({
                fullName: newApp.applicantName,
                email: newApp.applicantEmail,
                phone: newApp.contactNumber,
                profilePhotoLink: studentUser.profilePhotoUrl || '',
                studentClass: '', // This data is not collected in the form
                selectedCourse: newApp.course,
                certificate10Link: newApp.documentUrls.cert10th || '',
                certificate12Link: newApp.documentUrls.cert12th || '',
                applicationDate: newApp.submittedDate,
                status: newApp.status,
                photoURL: studentUser.profilePhotoUrl || '',
                videoURL: '', // This data is not collected
                role: studentUser.role,
            }).catch(error => console.error("Failed to send student application data to sheet:", error));
        }

        // 2. Find and notify the relevant college admin
        const adminUser = Object.values(updatedUsers).find(
            u => u.role === 'COLLEGE_ADMIN' && u.collegeId === newApp.collegeId
        );
        
        if (adminUser) {
            const newNotification: Notification = {
                id: `n-app-${Date.now()}`,
                type: 'application',
                title: 'New Application',
                message: `${newApp.applicantName} applied for ${newApp.course}.`,
                isRead: false,
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'}),
                link: '/admin/admissions'
            };
            // Create a new notifications array to ensure state update
            adminUser.notifications = [newNotification, ...adminUser.notifications];
        }
        
        return updatedUsers;
    });

    return newApp;
};
    
  const handleToggleFavorite = (collegeId: string) => {
       if (!user) return;
       const isFav = user.favoriteCollegeIds.includes(collegeId);
       const newFavs = isFav ? user.favoriteCollegeIds.filter(id => id !== collegeId) : [...user.favoriteCollegeIds, collegeId];
       const updatedUser = { ...user, favoriteCollegeIds: newFavs };
       setUser(updatedUser);
       setUsersData(prev => ({ ...prev, [user.id]: updatedUser }));
  };
  
  const handleToggleFavoriteCourse = (courseId: string) => {
       if (!user) return;
       const isFav = user.favoriteCourseIds.includes(courseId);
       const newFavs = isFav ? user.favoriteCourseIds.filter(id => id !== courseId) : [...user.favoriteCourseIds, courseId];
       const updatedUser = { ...user, favoriteCourseIds: newFavs };
       setUser(updatedUser);
       setUsersData(prev => ({ ...prev, [user.id]: updatedUser }));
  };

  const handleToggleFavoriteEvent = (eventId: string) => {
       if (!user) return;
       const isFav = user.favoriteEventIds.includes(eventId);
       const newFavs = isFav ? user.favoriteEventIds.filter(id => id !== eventId) : [...user.favoriteEventIds, eventId];
       const updatedUser = { ...user, favoriteEventIds: newFavs };
       setUser(updatedUser);
       setUsersData(prev => ({ ...prev, [user.id]: updatedUser }));
  };

  const handleUpdateUser = (updatedUser: User) => {
      if (!user) return;
      setUser(updatedUser);
      setUsersData(prev => ({ ...prev, [updatedUser.id]: updatedUser }));
      
      // Sync user profile updates to Google Sheets based on role
      if (updatedUser.role === 'COLLEGE_ADMIN') {
        sendAdminData({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || '',
          role: updatedUser.role,
        }).catch(error => console.error("Failed to send admin profile data to sheet:", error));
      } else {
        sendStudentData({
            fullName: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            profilePhotoLink: updatedUser.profilePhotoUrl || '',
            studentClass: '', // Not available on profile page
            selectedCourse: '', // Not applicable for general profile update
            certificate10Link: '', // Not available on profile page
            certificate12Link: '', // Not available on profile page
            applicationDate: new Date().toISOString(), // Use current date for update timestamp
            status: 'Profile Updated', // Custom status for this action
            photoURL: updatedUser.profilePhotoUrl || '',
            videoURL: '', // Not available
            role: updatedUser.role,
        }).catch(error => console.error("Failed to send user profile data to sheet:", error));
      }
  };
  
  const handleUpdateApplications = (updatedApps: Application[]) => {
    const originalAppsMap: Map<string, Application> = new Map(applications.map(app => [app.id, app]));
    let seatChanges: { [courseName: string]: { collegeId: string; change: number } } = {};
    const usersCopy = { ...usersData };
    let usersModified = false;

    updatedApps.forEach(updatedApp => {
        const originalApp = originalAppsMap.get(updatedApp.id);
        if (originalApp && JSON.stringify(originalApp) !== JSON.stringify(updatedApp)) {
             // Generate notification for the student if status changed
            const student = usersCopy[updatedApp.userId];
            if (student && originalApp.status !== updatedApp.status) {
                let message = `Your application for ${updatedApp.course} at ${updatedApp.collegeName} is now '${updatedApp.status}'.`;

                if (updatedApp.status === 'Appointment Scheduled' && updatedApp.appointmentDetails) {
                    message = `Your college visit for ${updatedApp.course} at ${updatedApp.collegeName} has been scheduled for ${new Date(updatedApp.appointmentDetails.date).toLocaleDateString()} at ${updatedApp.appointmentDetails.time}.`;
                } else if (updatedApp.status === 'Rejected') {
                    const rejectionNote = updatedApp.communicationHistory.find(h => h.action === 'Application Rejected');
                    const reason = rejectionNote ? rejectionNote.notes : 'Please contact the admissions office for details.';
                    message = `We regret to inform you that your application for ${updatedApp.course} at ${updatedApp.collegeName} has been rejected. ${reason}`;
                }

                const newNotification: Notification = {
                    id: `n-${Date.now()}`,
                    type: 'status',
                    title: 'Application Status Updated',
                    message: message,
                    isRead: false,
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'}),
                    link: '/status'
                };
                student.notifications = [newNotification, ...student.notifications];
                usersModified = true;
            }

            // Update seat counts if status changed to/from 'Confirmed'
            if (originalApp.status !== updatedApp.status) {
                const courseName = updatedApp.course;
                const collegeId = updatedApp.collegeId;
                if (!seatChanges[courseName]) {
                    seatChanges[courseName] = { collegeId, change: 0 };
                }
                if (updatedApp.status === 'Confirmed') seatChanges[courseName].change++;
                if (originalApp.status === 'Confirmed') seatChanges[courseName].change--;
            }
        }
    });
    
    if (usersModified) {
        setUsersData(usersCopy);
    }
    
    if (Object.keys(seatChanges).length > 0) {
        setColleges(prevColleges => {
            return prevColleges.map(college => {
                const updatedCourses = college.courses.map(course => {
                    const changeInfo = seatChanges[course.name];
                    if (changeInfo && changeInfo.collegeId === college.id && changeInfo.change !== 0) {
                        return { ...course, enrollmentCount: course.enrollmentCount + changeInfo.change };
                    }
                    return course;
                });
                return { ...college, courses: updatedCourses };
            });
        });
    }

    setApplications(updatedApps);
};

  
  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
    );
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    setUsersData(prev => ({...prev, [user.id]: updatedUser}));
  };

  const handleMarkAllNotificationsAsRead = () => {
      if (!user) return;
      const updatedNotifications = user.notifications.map(n => ({ ...n, isRead: true }));
      const updatedUser = { ...user, notifications: updatedNotifications };
      setUser(updatedUser);
      setUsersData(prev => ({...prev, [user.id]: updatedUser}));
  };
  
  const handleMarkMessagesAsRead = (applicationId: string) => {
    setChatMessages(prevMessages =>
        prevMessages.map(msg =>
            msg.applicationId === applicationId && msg.sender === 'student'
                ? { ...msg, read: true }
                : msg
        )
    );
  };

  const handleSendMessage = (applicationId: string, text: string, sender: 'student' | 'admin') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      applicationId,
      sender,
      text,
      timestamp: new Date().toISOString(),
      read: sender === 'admin', // Messages sent by admin are read by default for them
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleUpdateCollegeCourses = (collegeId: string, updatedCourses: Course[]) => {
      setColleges(prevColleges => 
        prevColleges.map(c => 
            c.id === collegeId ? { ...c, courses: updatedCourses } : c
        )
      );
  };
  
  const handleUpdateCollegeEvents = (collegeId: string, updatedEvents: CollegeEvent[]) => {
      setColleges(prevColleges => 
        prevColleges.map(c => 
            c.id === collegeId ? { ...c, events: updatedEvents } : c
        )
      );
  };

  const handleUpdateCollegeAds = (collegeId: string, updatedAds: FeaturedAd[]) => {
      setColleges(prevColleges => 
        prevColleges.map(c => 
            c.id === collegeId ? { ...c, featuredAds: updatedAds } : c
        )
      );
  };

  const handleUpdateCollegeInfoAds = (collegeId: string, updatedAds: CollegeAd[]) => {
      setColleges(prevColleges => 
        prevColleges.map(c => 
            c.id === collegeId ? { ...c, collegeAds: updatedAds } : c
        )
      );
  };

  const handleUpdateCollege = (updatedCollege: College) => {
    setColleges(prevColleges =>
        prevColleges.map(c =>
            c.id === updatedCollege.id ? updatedCollege : c
        )
    );
    
    // Sync with Make.com webhook
    if (user && user.role === 'COLLEGE_ADMIN') {
        sendCollegeData({
            collegeID: updatedCollege.id,
            collegeName: updatedCollege.name,
            location: updatedCollege.location,
            phone: updatedCollege.phone,
            upiId: updatedCollege.upiId,
            bannerImageURL: updatedCollege.photoUrl,
            logoURL: updatedCollege.logoUrl,
            fullDescription: updatedCollege.description,
            shortDescription: updatedCollege.shortDescription,
            featuredListing: updatedCollege.isFeatured ? 'Yes' : 'No',
            profileCompleteness: `${calculateProfileCompleteness(updatedCollege)}%`,
            admissionOpenDate: updatedCollege.admissionOpenDate,
            admissionCloseDate: updatedCollege.admissionCloseDate,
        }).catch(error => console.error("Failed to send college data to webhook:", error));
    }
  };

  const handleAddPaymentTransaction = (transactionData: Omit<PaymentTransaction, 'paymentId'>) => {
    const newTransaction: PaymentTransaction = {
        ...transactionData,
        paymentId: `txn-${Date.now()}`
    };
    setPaymentTransactions(prev => [...prev, newTransaction]);

    // Notify the relevant college admin about the new payment
    setUsersData(prevUsers => {
        const updatedUsers = { ...prevUsers };
        const adminUser = Object.values(updatedUsers).find(
            u => u.role === 'COLLEGE_ADMIN' && u.collegeId === newTransaction.collegeId
        );

        if (adminUser) {
            const newNotification: Notification = {
                id: `n-payment-${Date.now()}`,
                type: 'payment',
                title: 'Payment Received',
                message: `${newTransaction.studentName} paid ₹${newTransaction.amount} for ${newTransaction.courseName}. Verification needed.`,
                isRead: false,
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'}),
                link: '/admin/payments'
            };
            adminUser.notifications = [newNotification, ...adminUser.notifications];
        }
        
        return updatedUsers;
    });
  };

  const handleConfirmPayment = (transaction: PaymentTransaction, remarks: string) => {
    // 1. Update the transaction
    const updatedTransactions = paymentTransactions.map(t =>
        t.paymentId === transaction.paymentId
            ? { ...t, status: 'Confirmed' as const, verifiedByCollege: 'Yes' as const, remarks }
            : t
    );
    setPaymentTransactions(updatedTransactions);

    // 2. Notify the student
    setUsersData(prevUsers => {
        const student = prevUsers[transaction.studentId];
        if (student) {
            const newNotification: Notification = {
                id: `n-payment-${Date.now()}`,
                type: 'status',
                title: 'Payment Confirmed',
                message: `Your payment of ₹${transaction.amount} for ${transaction.courseName} at ${transaction.collegeName} has been confirmed.`,
                isRead: false,
                timestamp: new Date().toISOString(),
                link: '/wallet'
            };
            const updatedStudent = { ...student, notifications: [newNotification, ...student.notifications] };
            return { ...prevUsers, [student.id]: updatedStudent };
        }
        return prevUsers;
    });
  };

  const handleAddForumPost = (postData: Omit<ForumPost, 'id' | 'views' | 'replies' | 'lastActivity'>) => {
    const newPost: ForumPost = {
        ...postData,
        id: `post-${Date.now()}`,
        views: 0,
        replies: [],
        lastActivity: postData.timestamp,
    };
    setForumPosts(prev => [newPost, ...prev]);
  };

  const handleAddForumReply = (postId: string, replyData: Omit<ForumReply, 'id'>) => {
    setForumPosts(prevPosts =>
        prevPosts.map(post => {
            if (post.id === postId) {
                const newReply: ForumReply = { ...replyData, id: `reply-${Date.now()}` };
                return {
                    ...post,
                    replies: [...post.replies, newReply],
                    lastActivity: new Date().toISOString(),
                };
            }
            return post;
        })
    );
  };

  const handleViewPost = (postId: string) => {
    setForumPosts(prevPosts =>
        prevPosts.map(post =>
            post.id === postId ? { ...post, views: post.views + 1 } : post
        )
    );
  };
  
  const adminCollege = user && user.role === 'COLLEGE_ADMIN' ? colleges.find(c => c.id === user.collegeId) : null;
  const adminApplications = user && user.role === 'COLLEGE_ADMIN' ? applications.filter(a => a.collegeId === user.collegeId) : [];
  const adminTransactions = user && user.role === 'COLLEGE_ADMIN' ? paymentTransactions.filter(t => t.collegeId === user.collegeId) : [];
  const studentTransactions = user && user.role === 'STUDENT' ? paymentTransactions.filter(t => t.studentId === user.id) : [];


  return (
    <HashRouter>
      <Routes>
        {/* If no user, show role selection page */}
        {!user ? (
          <Route path="*" element={<RoleSelectionPage onSelectRole={handleSelectRole} />} />
        ) : 
        
        /* If user is STUDENT, show student routes */
        user.role === 'STUDENT' ? (
          <Route path="/" element={<MainLayout user={user} onMarkNotificationAsRead={handleMarkNotificationAsRead} onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead} onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage colleges={colleges} />} />
            <Route path="search" element={<SearchPage colleges={colleges} />} />
            <Route path="favorites" element={<FavoritesPage user={user} colleges={colleges} />} />
            <Route path="status" element={<AdmissionStatusPage applications={user.applications} />} />
            <Route path="chat/:applicationId" element={<AdmissionChatPage allMessages={chatMessages} applications={user.applications} onSendMessage={handleSendMessage} />} />
            <Route path="college/:id" element={<CollegeProfilePage user={user} onToggleFavorite={handleToggleFavorite} onToggleFavoriteCourse={handleToggleFavoriteCourse} colleges={colleges} />} />
            <Route path="college/:collegeId/course/:courseId" element={<CourseDetailsPage user={user} colleges={colleges} onToggleFavoriteCourse={handleToggleFavoriteCourse} />} />
            <Route path="college/:id/events" element={<EventsPage user={user} colleges={colleges} onToggleFavoriteEvent={handleToggleFavoriteEvent} />} />
            <Route path="apply/:collegeId" element={<AdmissionFormPage user={user} onAddApplication={handleAddApplication} colleges={colleges} onAddPaymentTransaction={handleAddPaymentTransaction} />} />
            <Route path="payment-status" element={<PaymentStatusPage />} />
            <Route path="confirmation" element={<ConfirmationPage />} />
            <Route path="travel" element={<TravelBookingPage />} />
            <Route path="loans" element={<LoanInfoPage />} />
            <Route path="ads" element={<AdsPage colleges={colleges} />} />
            <Route path="featured-ad/:collegeId/:courseId" element={<FeaturedAdDetailPage colleges={colleges} />} />
            <Route path="wallet" element={<WalletPage transactions={studentTransactions} />} />
            <Route path="community-forum" element={<CommunityForumPage posts={forumPosts} user={user} />} />
            <Route path="community-forum/new" element={<CreateForumPostPage user={user} onAddPost={handleAddForumPost} />} />
            <Route path="community-forum/:postId" element={<ForumPostPage posts={forumPosts} user={user} onAddReply={handleAddForumReply} onViewPost={handleViewPost} />} />
            <Route path="career-hub" element={<CareerHubPage />} />
            <Route path="profile" element={<ProfilePage user={user} onUpdateProfile={handleUpdateUser} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : 
        
        /* If user is ADMIN, show admin routes */
        user.role === 'COLLEGE_ADMIN' && adminCollege ? (
          <>
            <Route path="/admin" element={<AdminLayout user={user} college={adminCollege} notifications={user.notifications} onMarkNotificationAsRead={handleMarkNotificationAsRead} onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<CollegeAdminDashboardPage applications={adminApplications} college={adminCollege} paymentTransactions={adminTransactions} />} />
              <Route path="admissions" element={<AdmissionsLeadsPage applications={adminApplications} paymentTransactions={adminTransactions} onUpdateApplications={handleUpdateApplications} />} />
              <Route path="admissions/:applicationId" element={<StudentDetailsPage applications={applications} usersData={usersData} paymentTransactions={paymentTransactions} colleges={colleges} />} />
              <Route path="students" element={<StudentListPage applications={adminApplications} usersData={usersData} />} />
              <Route path="chat" element={<AdminChatDashboardPage applications={adminApplications} allMessages={chatMessages} onSendMessage={handleSendMessage} onMarkMessagesAsRead={handleMarkMessagesAsRead} onUpdateApplications={handleUpdateApplications} />} />
              <Route path="chat/:applicationId" element={<AdminMessagePage applications={adminApplications} allMessages={chatMessages} onSendMessage={handleSendMessage} />} />
              <Route path="payments" element={<PaymentRequestsPage transactions={adminTransactions} applications={adminApplications} />} />
              <Route path="payments/:applicationId" element={<PaymentRequestDetailsPage applications={applications} paymentTransactions={paymentTransactions} onUpdateApplications={handleUpdateApplications} colleges={colleges} />} />
              <Route path="manage-profile" element={<ManageCollegeProfilePage college={adminCollege} admin={user} />} />
              <Route path="manage-courses" element={<ManageCoursesPage college={adminCollege} onUpdateCourses={handleUpdateCollegeCourses} onUpdateCollege={handleUpdateCollege} />} />
              <Route path="manage-events" element={<ManageEventsPage college={adminCollege} onUpdate={handleUpdateCollegeEvents} />} />
              <Route path="manage-ads" element={<ManageAdsPage college={adminCollege} onUpdate={handleUpdateCollegeAds} />} />
              <Route path="manage-college-ads" element={<ManageCollegeAdsPage college={adminCollege} onUpdate={handleUpdateCollegeInfoAds} />} />
              <Route path="analytics" element={<AnalyticsPage college={adminCollege} />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          /* Fallback if user is somehow invalid */
          <Route path="*" element={<RoleSelectionPage onSelectRole={handleSelectRole} />} />
        )}
      </Routes>
    </HashRouter>
  );
}

export default App;
