import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Application, CommunicationEntry, PaymentTransaction } from '../../types';
import { CalendarDaysIcon, XCircleIcon, CheckCircleIcon, ClockIcon } from '../../components/icons';

type UIStatus = "Pending" | "Verified" | "Appointment Scheduled" | "Confirmed" | "Rejected";

const statusToUI: Record<Application['status'], UIStatus> = {
    'Pending': 'Pending',
    'Verified': 'Verified',
    'Appointment Scheduled': 'Appointment Scheduled',
    'Confirmed': 'Confirmed',
    'Rejected': 'Rejected'
};

const uiToStatus: Record<UIStatus, Application['status']> = {
    'Pending': 'Pending',
    'Verified': 'Verified',
    'Appointment Scheduled': 'Appointment Scheduled',
    'Confirmed': 'Confirmed',
    'Rejected': 'Rejected'
};

const filterTabs: UIStatus[] = ["Pending", "Verified", "Appointment Scheduled", "Confirmed", "Rejected"];

const statusStyles: Record<UIStatus, { bg: string; text: string; ring: string; border: string; }> = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-600/20', border: 'border-yellow-500' },
    Verified: { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-600/20', border: 'border-blue-500' },
    'Appointment Scheduled': { bg: 'bg-purple-100', text: 'text-purple-800', ring: 'ring-purple-600/20', border: 'border-purple-500' },
    Confirmed: { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-600/20', border: 'border-green-500' },
    Rejected: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-600/20', border: 'border-red-500' },
};

// --- Modals ---

const ScheduleModal: React.FC<{
  application: Application;
  onClose: () => void;
  onSave: (appId: string, details: { date: string; time: string; location: string }) => void;
}> = ({ application, onClose, onSave }) => {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('Admissions Office, Main Campus');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && time) {
            onSave(application.id, { date, time, location });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSave}>
                    <header className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Schedule College Visit</h2>
                        <p className="text-sm text-gray-500">For: {application.applicantName}</p>
                    </header>
                    <main className="p-6 space-y-4">
                        <div>
                            <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" id="visitDate" value={date} onChange={e => setDate(e.target.value)} min={today} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="visitTime" className="block text-sm font-medium text-gray-700">Time</label>
                            <input type="time" id="visitTime" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </main>
                    <footer className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Schedule & Notify</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

const RejectModal: React.FC<{
  application: Application;
  onClose: () => void;
  onSave: (appId: string, reason: string) => void;
}> = ({ application, onClose, onSave }) => {
    const [reason, setReason] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            onSave(application.id, reason.trim());
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                 <form onSubmit={handleSave}>
                    <header className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Reject Application</h2>
                        <p className="text-sm text-gray-500">For: {application.applicantName}</p>
                    </header>
                    <main className="p-6">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">Reason for Rejection</label>
                        <textarea id="rejectionReason" value={reason} onChange={e => setReason(e.target.value)} rows={4} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Provide a clear reason for the student..."></textarea>
                    </main>
                    <footer className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Reject & Notify</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

// --- Main Page ---

interface AdminAdmissionsLeadsProps {
    applications: Application[];
    paymentTransactions: PaymentTransaction[];
    onUpdateApplications: (apps: Application[]) => void;
}


const AdminAdmissionsLeads: React.FC<AdminAdmissionsLeadsProps> = ({ applications, paymentTransactions, onUpdateApplications }) => {
    const [activeFilter, setActiveFilter] = useState<UIStatus | 'All'>('All');
    const [modalState, setModalState] = useState<{ type: 'schedule' | 'reject' | null; app: Application | null }>({ type: null, app: null });
    const navigate = useNavigate();

    const filteredApplications = useMemo(() => {
        if (activeFilter === 'All') return applications;
        return applications.filter(app => statusToUI[app.status] === activeFilter);
    }, [applications, activeFilter]);
    
    const handleStatusChange = (appId: string, newUiStatus: UIStatus) => {
        const newAppStatus = uiToStatus[newUiStatus];
        const updatedApps = applications.map(app => 
            app.id === appId ? { ...app, status: newAppStatus } : app
        );
        onUpdateApplications(updatedApps);
    };

    const handleScheduleSave = (appId: string, details: { date: string; time: string; location: string }) => {
        const updatedApps = applications.map(app => 
            app.id === appId 
                ? { ...app, status: 'Appointment Scheduled' as const, appointmentDetails: details } 
                : app
        );
        onUpdateApplications(updatedApps);
        setModalState({ type: null, app: null });
    };

    const handleRejectSave = (appId: string, reason: string) => {
        const updatedApps = applications.map(app => {
            if (app.id === appId) {
                const newHistoryEntry: CommunicationEntry = {
                    id: `ch-${Date.now()}`,
                    date: new Date().toISOString(),
                    action: 'Application Rejected',
                    notes: `Reason: ${reason}`,
                };
                return {
                    ...app,
                    status: 'Rejected' as const,
                    communicationHistory: [...app.communicationHistory, newHistoryEntry],
                };
            }
            return app;
        });
        onUpdateApplications(updatedApps);
        setModalState({ type: null, app: null });
    };

    const handleViewDetails = (appId: string) => navigate(`/admin/admissions/${appId}`);
    
    const handleMessageStudent = (appId: string) => {
        navigate(`/admin/chat/${appId}`);
    };


    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Admissions & Leads</h1>

          <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
                  <button onClick={() => setActiveFilter('All')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeFilter === 'All' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      All ({applications.length})
                  </button>
                  {filterTabs.map(tab => {
                      const count = applications.filter(app => statusToUI[app.status] === tab).length;
                      return ( <button key={tab} onClick={() => setActiveFilter(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeFilter === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                              {tab} ({count})
                          </button>
                      );
                  })}
              </nav>
          </div>
          
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course / Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application Stage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map(app => {
                          const uiStatus = statusToUI[app.status];
                          const isActionable = app.status !== 'Confirmed' && app.status !== 'Rejected';
                          const payment = paymentTransactions.find(p => p.applicationId === app.id);
                          return (
                              <tr key={app.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap align-top">
                                      <p className="font-medium text-gray-900">{app.applicantName}</p>
                                      <p className="text-sm text-gray-500">{app.applicantEmail}</p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <p className="text-sm text-gray-700 font-semibold">{app.course}</p>
                                    <p className="text-sm text-gray-500">Applied: {new Date(app.submittedDate).toLocaleDateString()}</p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap align-top">
                                      <Link to={`/admin/admissions/${app.id}`} className="inline-block hover:underline" aria-label={`View details for ${app.applicantName}`}>
                                          {payment && payment.status === 'Confirmed' ? (
                                              <span className="font-semibold text-purple-700">Paid</span>
                                          ) : (
                                              <span className="font-semibold text-yellow-700">Not Paid</span>
                                          )}
                                      </Link>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <select value={uiStatus} onChange={(e) => handleStatusChange(app.id, e.target.value as UIStatus)} className={`text-xs font-semibold rounded-md border-0 py-1 pl-2 pr-7 focus:ring-2 focus:ring-inset ${statusStyles[uiStatus].bg} ${statusStyles[uiStatus].text} ${statusStyles[uiStatus].ring.replace('ring-', 'focus:ring-')}`}>
                                        {filterTabs.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 align-top">
                                      <button onClick={() => handleViewDetails(app.id)} className="text-gray-600 hover:text-indigo-600" title="View Details">View</button>
                                      <button onClick={() => handleMessageStudent(app.id)} className="text-gray-600 hover:text-indigo-600" title="Message Student">Message</button>
                                      {isActionable && (
                                        <>
                                        <button onClick={() => setModalState({ type: 'schedule', app })} className="text-blue-600 hover:text-blue-900" title="Schedule Visit">Schedule</button>
                                        <button onClick={() => setModalState({ type: 'reject', app })} className="text-red-600 hover:text-red-900" title="Reject Application">Reject</button>
                                        </>
                                      )}
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>

          {filteredApplications.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                  <p>No applications match the current filter.</p>
              </div>
          )}

          {modalState.type === 'schedule' && modalState.app && (
            <ScheduleModal application={modalState.app} onClose={() => setModalState({ type: null, app: null })} onSave={handleScheduleSave} />
          )}
          {modalState.type === 'reject' && modalState.app && (
            <RejectModal application={modalState.app} onClose={() => setModalState({ type: null, app: null })} onSave={handleRejectSave} />
          )}

      </div>
    );
};

export default AdminAdmissionsLeads;