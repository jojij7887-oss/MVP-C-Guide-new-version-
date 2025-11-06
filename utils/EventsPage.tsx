
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { User, College, CollegeEvent } from '../types';
import BackButton from '../components/BackButton';
import { StarIcon, ShareIcon, LinkIcon, XMarkIcon, PlayCircleIcon } from '../components/icons';

interface EventsPageProps {
  user: User;
  colleges: College[];
  onToggleFavoriteEvent: (eventId: string) => void;
}

const MediaViewerModal: React.FC<{ event: CollegeEvent, onClose: () => void }> = ({ event, onClose }) => {
    const isVideo = event.mediaUrl.endsWith('.mp4');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10" aria-label="Close media viewer">
                    <XMarkIcon className="h-8 w-8" />
                </button>
                {isVideo ? (
                    <video src={event.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                    <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-contain" />
                )}
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-sm">{event.description}</p>
                </div>
            </div>
        </div>
    );
};

const SharePopover: React.FC<{ event: CollegeEvent, onClose: () => void }> = ({ event, onClose }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const eventUrl = window.location.href;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleCopy = () => {
        navigator.clipboard.writeText(eventUrl).then(() => {
            alert('Link copied to clipboard!');
            onClose();
        });
    };

    const shareText = `Check out this event: ${event.title}!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + eventUrl)}`;

    return (
        <div ref={popoverRef} className="absolute right-0 bottom-10 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Share on WhatsApp</a>
            <button onClick={handleCopy} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LinkIcon className="h-4 w-4" /> Copy Link
            </button>
        </div>
    );
};

const EventsPage: React.FC<EventsPageProps> = ({ user, colleges, onToggleFavoriteEvent }) => {
  const { id } = useParams<{ id: string }>();
  const college = colleges.find(c => c.id === id);

  const [viewingMedia, setViewingMedia] = useState<CollegeEvent | null>(null);
  const [activeShareMenu, setActiveShareMenu] = useState<string | null>(null);

  if (!college) {
    return <div className="text-center text-red-500 text-xl p-8">College not found.</div>;
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Campus Life</h1>
          <p className="mt-1 text-lg text-gray-600">Discover what's happening at <span className="font-semibold">{college.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {college.events.map(event => {
            const isFavorite = user.favoriteEventIds.includes(event.id);
            const isVideo = event.mediaUrl.endsWith('.mp4');

            return (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
                    <div className="relative cursor-pointer" onClick={() => setViewingMedia(event)}>
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                             {isVideo ? (
                                <div className="w-full h-full bg-black">
                                    <video muted loop playsInline className="w-full h-full object-cover">
                                        <source src={event.mediaUrl} type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                        <PlayCircleIcon className="h-16 w-16 text-white opacity-90" />
                                    </div>
                                </div>
                            ) : (
                                <img src={event.mediaUrl} alt={event.title} className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                        {event.date && event.location && (
                             <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                <span>📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                <span>📍 {event.location}</span>
                            </div>
                        )}
                        <p className="mt-2 text-gray-600 flex-grow">{event.description}</p>
                        
                        <div className="mt-4 pt-4 border-t flex justify-end items-center space-x-2">
                             <div className="relative">
                                <button
                                    onClick={() => setActiveShareMenu(activeShareMenu === event.id ? null : event.id)}
                                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                    title="Share Event"
                                >
                                    <ShareIcon className="h-5 w-5" />
                                </button>
                                {activeShareMenu === event.id && <SharePopover event={event} onClose={() => setActiveShareMenu(null)} />}
                            </div>
                            <button
                                onClick={() => onToggleFavoriteEvent(event.id)}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                            >
                                <StarIcon className={`h-6 w-6 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`} solid={isFavorite} />
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
      
      {viewingMedia && (
        <MediaViewerModal event={viewingMedia} onClose={() => setViewingMedia(null)} />
      )}
    </div>
  );
};

export default EventsPage;