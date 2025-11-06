import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ForumPost, User } from '../types';
import { SearchIcon, ChatBubbleLeftRightIcon, EyeIcon } from '../components/icons';

interface CommunityForumPageProps {
  posts: ForumPost[];
  user: User;
}

const formatDistanceToNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const CommunityForumPage: React.FC<CommunityForumPageProps> = ({ posts, user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredPosts = useMemo(() => {
        const lowercasedQuery = searchTerm.toLowerCase();
        if (!lowercasedQuery) return posts;
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.content.toLowerCase().includes(lowercasedQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
        );
    }, [posts, searchTerm]);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                    <p className="mt-2 text-lg text-gray-600">Ask questions, share advice, and connect with fellow students.</p>
                </div>
                <Link to="/community-forum/new" className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                    Create New Post
                </Link>
            </div>
            
            <div className="relative">
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts by title, content, or tags..."
                    className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    aria-label="Search forum posts"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-6 w-6 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <li key={post.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/community-forum/${post.id}`)}>
                            <div className="flex items-start space-x-4">
                                <img src={post.authorPhotoUrl} alt={post.authorName} className="h-10 w-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-indigo-700">{post.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Posted by <span className="font-medium">{post.authorName}</span> • {formatDistanceToNow(post.timestamp)}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {post.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>)}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                        <span>{post.replies.length}</span>
                                    </div>
                                     <div className="flex items-center gap-1.5">
                                        <EyeIcon className="h-5 w-5" />
                                        <span>{post.views}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )) : (
                        <li className="p-8 text-center text-gray-500">
                            No posts found. {searchTerm ? 'Try a different search.' : 'Be the first to create one!'}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommunityForumPage;