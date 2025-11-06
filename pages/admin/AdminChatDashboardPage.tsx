import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Application, ChatMessage } from '../../types';
import { CheckCircleIcon, XCircleIcon } from '../../components/icons';

interface AdminChatDashboardPageProps {
    applications: Application[];
    allMessages: ChatMessage[];
    onSendMessage: (applicationId: string, text: string, sender: 'admin') => void;
    onMarkMessagesAsRead: (applicationId: string) => void;
    onUpdateApplications: (apps: Application[]) => void;
}

const AdminChatDashboardPage: React.FC<AdminChatDashboardPageProps> = ({ applications, allMessages, onSendMessage, onMarkMessagesAsRead, onUpdateApplications }) => {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversations = useMemo(() => {
        const convos = new Map<string, { app: Application; lastMessage: ChatMessage; unreadCount: number }>();
        
        applications.forEach(app => {
            const appMessages = allMessages.filter(m => m.applicationId === app.id);
            if (appMessages.length > 0) {
                const sortedMessages = [...appMessages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                convos.set(app.id, {
                    app,
                    lastMessage: sortedMessages[0],
                    unreadCount: appMessages.filter(m => m.sender === 'student' && !m.read).length,
                });
            }
        });
        
        return Array.from(convos.values()).sort((a,b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    }, [applications, allMessages]);
    
    const selectedConversation = conversations.find(c => c.app.id === selectedAppId);
    const selectedMessages = useMemo(() => {
        return allMessages.filter(msg => msg.applicationId === selectedAppId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [allMessages, selectedAppId]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [selectedMessages]);

    useEffect(() => {
        if (selectedAppId) {
            onMarkMessagesAsRead(selectedAppId);
        }
    }, [selectedAppId, onMarkMessagesAsRead]);

    const handleSelectConversation = (appId: string) => {
        setSelectedAppId(appId);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedAppId) {
            onSendMessage(selectedAppId, newMessage, 'admin');
            setNewMessage('');
        }
    };
    
    const handleStatusUpdate = (status: 'Confirmed' | 'Rejected') => {
        if (!selectedAppId || !window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) return;
        const updatedApps = applications.map(app => 
            app.id === selectedAppId ? { ...app, status } : app
        );
        onUpdateApplications(updatedApps);
        onSendMessage(selectedAppId, `The status of your application has been updated to: ${status}.`, 'admin');
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Left Panel: Conversations List */}
            <aside className="w-1/3 border-r flex flex-col">
                <header className="p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Conversations ({conversations.length})</h1>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(({ app, lastMessage, unreadCount }) => (
                        <div
                            key={app.id}
                            onClick={() => handleSelectConversation(app.id)}
                            className={`p-4 cursor-pointer border-l-4 ${selectedAppId === app.id ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-gray-50 border-transparent'}`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-900">{app.applicantName}</p>
                                {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{app.course}</p>
                            <p className={`text-sm text-gray-600 truncate mt-1 ${unreadCount > 0 ? 'font-bold' : ''}`}>
                                {lastMessage.sender === 'admin' ? 'You: ' : ''}{lastMessage.text}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right Panel: Chat Window */}
            <main className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <>
                        <header className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{selectedConversation.app.applicantName}</h2>
                                <p className="text-sm text-gray-600">{selectedConversation.app.course} - <span className="font-semibold">{selectedConversation.app.status}</span></p>
                            </div>
                            {selectedConversation.app.status !== 'Confirmed' && selectedConversation.app.status !== 'Rejected' && (
                                <div className="space-x-2">
                                    <button onClick={() => handleStatusUpdate('Confirmed')} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> Confirm</button>
                                    <button onClick={() => handleStatusUpdate('Rejected')} className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 flex items-center gap-1"><XCircleIcon className="h-4 w-4" /> Reject</button>
                                </div>
                            )}
                        </header>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-100">
                           {selectedMessages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-start' : 'items-end'}`}>
                                    <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-white shadow-sm' : 'bg-indigo-500 text-white'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your reply..." className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                <button type="submit" className="bg-indigo-600 text-white font-semibold rounded-full p-3 hover:bg-indigo-700 disabled:bg-gray-400" disabled={!newMessage.trim()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminChatDashboardPage;
