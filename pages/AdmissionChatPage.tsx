import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Application, ChatMessage } from '../types';
import BackButton from '../components/BackButton';
import { CheckCircleIcon, ClockIcon, XCircleIcon, CalendarDaysIcon } from '../components/icons';

// Map internal status to UI display properties
const statusDisplayInfo: { [key in Application['status']]: { label: string; color: string; } } = {
    Pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
    },
    Verified: {
        label: 'Verification',
        color: 'bg-blue-100 text-blue-800',
    },
    'Appointment Scheduled': {
        label: 'Scheduled',
        color: 'bg-purple-100 text-purple-800',
    },
    Confirmed: {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-800',
    },
    Rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800',
    },
};

interface AdmissionChatPageProps {
    allMessages: ChatMessage[];
    applications: Application[];
    onSendMessage: (applicationId: string, text: string, sender: 'student') => void;
}

const AdmissionChatPage: React.FC<AdmissionChatPageProps> = ({ allMessages, applications, onSendMessage }) => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const application = applications.find(app => app.id === applicationId);
    const messages = allMessages.filter(msg => msg.applicationId === applicationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && applicationId) {
            onSendMessage(applicationId, newMessage, 'student');
            setNewMessage('');
        }
    };
    
    if (!application) {
        return <div className="text-center py-10">Application not found.</div>;
    }

    const display = statusDisplayInfo[application.status];
    const lastAdminNote = application.communicationHistory
        .filter(h => h.action !== 'Student Message' && h.action !== 'Application Received')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <header className="p-4 border-b space-y-4">
                <div className="flex justify-between items-start">
                    <BackButton />
                    <div className={`px-3 py-1.5 text-sm font-semibold rounded-full inline-flex items-center ${display.color}`}>
                        Status: {display.label}
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Application Details: {application.course}</h1>
                    <p className="text-sm text-gray-600">at {application.collegeName}</p>
                </div>
                
                {application.status === 'Appointment Scheduled' && application.appointmentDetails && (
                    <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                        <p className="font-semibold text-purple-800">Appointment Details:</p>
                        <p className="text-sm text-purple-700">
                            <strong>Date:</strong> {application.appointmentDetails.date}, <strong>Time:</strong> {application.appointmentDetails.time}
                        </p>
                        <p className="text-sm text-purple-700">
                            <strong>Location:</strong> {application.appointmentDetails.location}
                        </p>
                    </div>
                )}

                {lastAdminNote && (
                    <div className="p-3 bg-gray-100 border-l-4 border-gray-400 rounded-r-lg">
                         <p className="font-semibold text-gray-800">Last Admin Update:</p>
                         <p className="text-sm text-gray-700">
                             "{lastAdminNote.notes}" - <span className="text-xs">{new Date(lastAdminNote.date).toLocaleDateString()}</span>
                         </p>
                    </div>
                )}
            </header>

            <main className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'student' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p>{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-white border-t">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Your message"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold rounded-full p-3 hover:bg-indigo-700 disabled:bg-gray-400"
                        aria-label="Send message"
                        disabled={!newMessage.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default AdmissionChatPage;