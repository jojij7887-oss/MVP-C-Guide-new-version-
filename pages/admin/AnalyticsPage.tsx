import React, { useState } from 'react';
import { ChartBarIcon, ClipboardListIcon, MegaphoneIcon, Cog6ToothIcon, CalendarDaysIcon, XMarkIcon, UserGroupIcon } from '../../components/icons';
import AiPredictionsWidget from '../../components/AiPredictionsWidget';
import CustomizeDashboardModal from '../../components/CustomizeDashboardModal';
import ReportSchedulerModal from '../../components/ReportSchedulerModal';
import DrillDownModal from '../../components/DrillDownModal';
import { College, Course } from '../../types';

type WidgetKey = 'stats' | 'funnel' | 'engagement' | 'aiPredictions' | 'seatOccupancy';

interface WidgetConfig {
    visible: boolean;
    title: string;
}

// Mock data for drill-downs
const mockAnalyticsData = {
    totalApplications: {
        list: [
            { id: 'app-1', name: 'Alex Doe', course: 'Computer Science', date: '2024-07-20' },
            { id: 'app-3', name: 'Michael Brown', course: 'MBA', date: '2024-07-15' },
            { id: 'app-4', name: 'Sarah Wilson', course: 'Data Science', date: '2024-07-21' },
        ]
    },
    profileViews: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [8200, 9100, 11500, 13000, 15600, 14800],
    },
    adClicks: {
        list: [
            { id: 'ad-1', title: 'Summer CS Program', clicks: 850 },
            { id: 'ad-2', title: 'New Arts Scholarship', clicks: 655 },
            { id: 'ad-3', title: 'MBA Early Bird Discount', clicks: 590 },
        ]
    }
};


const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, onClick?: () => void }> = ({ title, value, icon, onClick }) => (
    <div 
        className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105 transition-transform' : ''}`}
        onClick={onClick}
    >
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const SeatOccupancyWidget: React.FC<{ courses: Course[] }> = ({ courses }) => {
    const coursesWithSeats = courses.filter(c => c.totalSeats && c.totalSeats > 0);
    
    const topCourses = coursesWithSeats
        .map(course => ({
            ...course,
            occupancy: (course.enrollmentCount / course.totalSeats!) * 100,
        }))
        .sort((a, b) => b.occupancy - a.occupancy)
        .slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Seat Occupancy Rate</h2>
            <div className="space-y-3">
                {topCourses.map(course => (
                    <div key={course.id}>
                        <div className="flex justify-between items-center mb-1">
                           <p className="text-sm font-medium text-gray-600 truncate pr-2">{course.name}</p>
                           <p className="text-sm font-semibold text-gray-800">{course.occupancy.toFixed(0)}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                           <div
                                className="bg-green-500 h-2.5 rounded-full"
                                style={{ width: `${course.occupancy}%` }}
                           ></div>
                        </div>
                    </div>
                ))}
                {topCourses.length === 0 && <p className="text-sm text-center text-gray-500 py-8">No courses with seat data available.</p>}
            </div>
        </div>
    );
};

const AnalyticsPage: React.FC<{ college: College }> = ({ college }) => {
    const [widgets, setWidgets] = useState<Record<WidgetKey, WidgetConfig>>({
        stats: { visible: true, title: 'Key Metrics' },
        funnel: { visible: true, title: 'Application Funnel' },
        engagement: { visible: true, title: 'Student Engagement Over Time' },
        aiPredictions: { visible: true, title: 'AI Trend Predictions' },
        seatOccupancy: { visible: true, title: 'Seat Occupancy Rate' },
    });
    
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
    const [drillDownInfo, setDrillDownInfo] = useState<{ title: string; data: any } | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="mt-1 text-gray-600">Dynamic insights into your college's performance.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setIsSchedulerModalOpen(true)} className="bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"><CalendarDaysIcon className="h-5 w-5" /> Schedule Report</button>
                    <button onClick={() => setIsCustomizeModalOpen(true)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"><Cog6ToothIcon className="h-5 w-5" /> Customize</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Stats Widget */}
                {widgets.stats.visible && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Applications" value="1,284" icon={<ClipboardListIcon className="h-6 w-6" />} onClick={() => setDrillDownInfo({ title: 'Total Applications', data: mockAnalyticsData.totalApplications })} />
                        <StatCard title="Profile Views (30 days)" value="15.6K" icon={<ChartBarIcon className="h-6 w-6" />} onClick={() => setDrillDownInfo({ title: 'Profile Views (30 days)', data: mockAnalyticsData.profileViews })} />
                        <StatCard title="Ad Clicks" value="2,105" icon={<MegaphoneIcon className="h-6 w-6" />} onClick={() => setDrillDownInfo({ title: 'Ad Clicks', data: mockAnalyticsData.adClicks })}/>
                    </div>
                )}

                {/* AI Predictions Widget */}
                {widgets.aiPredictions.visible && <div className="lg:col-span-2"><AiPredictionsWidget /></div>}
                
                {/* Seat Occupancy Widget */}
                {widgets.seatOccupancy.visible && <div className="lg:col-span-2"><SeatOccupancyWidget courses={college.courses} /></div>}

                {/* Funnel Widget */}
                {widgets.funnel.visible && (
                    <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{widgets.funnel.title}</h2>
                        <div className="space-y-2 text-center text-sm text-gray-700">
                             <p>Profile Views: 15,600</p>
                            <p className="text-xl">↓</p>
                            <p>Applications Started: 3,400 (21.8%)</p>
                            <p className="text-xl">↓</p>
                            <p>Applications Submitted: 1,284 (37.8%)</p>
                            <p className="text-xl">↓</p>
                            <p className="font-bold text-green-600">Confirmed: 320 (24.9%)</p>
                        </div>
                    </div>
                )}
                
                {/* Engagement Widget */}
                {widgets.engagement.visible && (
                     <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{widgets.engagement.title}</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">[Chart Placeholder]</p>
                        </div>
                    </div>
                )}
            </div>
            
            {isCustomizeModalOpen && (
                <CustomizeDashboardModal 
                    widgets={widgets}
                    onClose={() => setIsCustomizeModalOpen(false)}
                    onSave={setWidgets}
                />
            )}
            
            {isSchedulerModalOpen && (
                <ReportSchedulerModal onClose={() => setIsSchedulerModalOpen(false)} />
            )}

            {drillDownInfo && (
                <DrillDownModal 
                    title={drillDownInfo.title}
                    data={drillDownInfo.data}
                    onClose={() => setDrillDownInfo(null)}
                />
            )}
        </div>
    );
};

export default AnalyticsPage;