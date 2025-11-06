import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Application, ChatMessage } from '../../types';
import { ArrowLeftIcon } from '../../components/icons';

interface AdminMessagePageProps {
    applications: Application[];
    allMessages: ChatMessage[];
    onSendMessage: (applicationId: string, text: string, sender: 'admin') => void;
}

const AdminMessagePage: React.FC<AdminMessagePageProps> = ({ applications, allMessages, onSendMessage }) => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const navigate = useNavigate();
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
            onSendMessage(applicationId, newMessage, 'admin');
            setNewMessage('');
        }
    };

    if (!application) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-600">Application Chat Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                aria-label="Go back to the previous page"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
            </button>

            <div className="flex flex-col h-[calc(100vh-14rem)] bg-white shadow-lg rounded-lg">
                <header className="p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Chat with: {application.applicantName}</h1>
                    <p className="text-sm text-gray-600">Regarding: {application.course}</p>
                </header>

                <main className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-start' : 'items-end'}`}>
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-gray-200 text-gray-800' : 'bg-indigo-500 text-white'}`}>
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
        </div>
    );
};

export default AdminMessagePage;