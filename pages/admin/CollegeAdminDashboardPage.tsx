import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  ClipboardListIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon
} from '../../components/icons';
import Loader from '../../components/Loader';
import { Application, College, Course, PaymentTransaction } from '../../types';

interface CollegeAdminDashboardPageProps {
  applications: Application[];
  college: College;
  paymentTransactions: PaymentTransaction[];
}

interface DashboardData {
  stats: {
    totalApplications: number;
    pendingApplications: number;
    profileViews: number;
  };
  features: {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


const AdminDashboardCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
  <Link to={to} className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
  </Link>
);

const PopularCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
    const popularCourses = [...courses]
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 5);

    if (popularCourses.length === 0) {
        return null; 
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Popular Courses</h2>
                <Link to="/admin/manage-courses" className="text-sm font-semibold text-indigo-600 hover:underline">
                    View All Courses &rarr;
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCourses.map(course => {
                    return (
                        <div key={course.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                            <div className="text-sm text-gray-600 space-y-2 flex-grow">
                                <p><strong className="text-gray-700">Fees:</strong> {course.fees}</p>
                                <p>
                                    <strong className="text-gray-700">Seat Status:</strong>
                                    {' '}
                                    {course.enrollmentCount} / {course.totalSeats || 'N/A'} filled
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const PaymentRequestsSection: React.FC<{ transactions: PaymentTransaction[], applications: Application[] }> = ({ transactions, applications }) => {
    const navigate = useNavigate();
    
    const paymentDetails = useMemo(() => {
        return transactions
            .map(t => {
                const app = applications.find(a => a.id === t.applicationId);
                if (!app) return null;
                return {
                    ...t,
                    appliedDate: app.submittedDate,
                };
            })
            .filter(Boolean) as (PaymentTransaction & { appliedDate: string })[];
    }, [transactions, applications]);

    const recentPayments = paymentDetails.slice(0, 5); // Show latest 5

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">💰 Payment Requests</h2>
                <Link to="/admin/payments" className="text-sm font-semibold text-indigo-600 hover:underline">
                    View All Payments &rarr;
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentPayments.map(payment => (
                                <tr key={payment.paymentId}>
                                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{payment.studentName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{payment.courseName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {payment.status === 'Confirmed' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"><CheckCircleIcon className="h-4 w-4" /> Paid</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"><ClockIcon className="h-4 w-4" /> Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.appliedDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => navigate(`/admin/admissions/${payment.applicationId}`)} className="text-indigo-600 hover:text-indigo-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {recentPayments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No payment requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};


const DashboardContent: React.FC<{ data: DashboardData; college: College, applications: Application[], paymentTransactions: PaymentTransaction[] }> = ({ data, college, applications, paymentTransactions }) => {
  const { stats, features } = data;
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Administrator Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Manage your college's presence on C Guide.</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Applications" value={stats.totalApplications.toLocaleString()} icon={<ClipboardListIcon className="h-6 w-6" />} />
            <StatCard title="Pending Applications" value={stats.pendingApplications.toLocaleString()} icon={<UserGroupIcon className="h-6 w-6" />} />
            <StatCard title="Profile Views (30 days)" value={stats.profileViews.toLocaleString()} icon={<ChartBarIcon className="h-6 w-6" />} />
       </div>
       
       <PaymentRequestsSection transactions={paymentTransactions} applications={applications} />
       
       <PopularCourses courses={college.courses} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <AdminDashboardCard key={feature.to} {...feature} />
        ))}
      </div>
    </div>
  );
};


const CollegeAdminDashboardPage: React.FC<CollegeAdminDashboardPageProps> = ({ applications, college, paymentTransactions }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = () => {
      // Simulate fetching data from an API
      setTimeout(() => {
        if (isMounted) {
            const mockData: DashboardData = {
                stats: {
                    totalApplications: applications.length,
                    pendingApplications: applications.filter(a => a.status === 'Pending').length,
                    profileViews: 15600,
                },
                features: [
                    { to: '/admin/admissions', icon: <ClipboardListIcon className="h-8 w-8" />, title: 'Admissions & Leads', description: 'Manage student applications and leads.' },
                    { to: '/admin/manage-profile', icon: <BuildingOfficeIcon className="h-8 w-8" />, title: 'Manage College Profile', description: 'Update your college\'s public information.' },
                    { to: '/admin/manage-courses', icon: <BookOpenIcon className="h-8 w-8" />, title: 'Manage Courses', description: 'Add, edit, or remove course listings.' },
                    { to: '/admin/manage-events', icon: <CalendarDaysIcon className="h-8 w-8" />, title: 'Manage Events', description: 'Promote upcoming events on campus.' },
                    { to: '/admin/analytics', icon: <ChartBarIcon className="h-8 w-8" />, title: 'Analytics', description: 'View student engagement and ad performance.' },
                    { to: '/admin/manage-ads', icon: <MegaphoneIcon className="h-8 w-8" />, title: 'Manage Ads', description: 'Create and manage promotional ads.' },
                ]
            };
            setData(mockData);
            setLoading(false);
        }
      }, 1500); // 1.5 second delay
    };

    fetchDashboardData();
    
    return () => { isMounted = false; }; // cleanup on unmount
  }, [applications]);

  if (loading || !college) return <Loader />;
  if (!data) return <div className="text-center text-gray-500 py-10">No data available or failed to load.</div>;

  return <DashboardContent data={data} college={college} applications={applications} paymentTransactions={paymentTransactions} />;
};

export default CollegeAdminDashboardPage;