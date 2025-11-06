import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ForumPost, ForumReply, User } from '../types';
import BackButton from '../components/BackButton';
import { ChatBubbleLeftRightIcon } from '../components/icons';

interface ForumPostPageProps {
  posts: ForumPost[];
  user: User;
  onAddReply: (postId: string, replyData: Omit<ForumReply, 'id'>) => void;
  onViewPost: (postId: string) => void;
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const ForumPostPage: React.FC<ForumPostPageProps> = ({ posts, user, onAddReply, onViewPost }) => {
    const { postId } = useParams<{ postId: string }>();
    const [newReply, setNewReply] = useState('');
    const post = posts.find(p => p.id === postId);

    useEffect(() => {
        if (postId) {
            onViewPost(postId);
        }
    }, [postId, onViewPost]);

    if (!post) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
                <BackButton className="mt-6" />
            </div>
        );
    }

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        const replyData = {
            postId: post.id,
            authorId: user.id,
            authorName: user.name,
            authorPhotoUrl: user.profilePhotoUrl,
            content: newReply,
            timestamp: new Date().toISOString(),
        };
        onAddReply(post.id, replyData);
        setNewReply('');
    };

    return (
        <div className="space-y-6">
            <BackButton />
            <div className="bg-white p-8 rounded-lg shadow-lg">
                {/* Original Post */}
                <div className="border-b pb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                    <div className="flex items-center space-x-3 mt-3">
                        <img src={post.authorPhotoUrl} alt={post.authorName} className="h-10 w-10 rounded-full object-cover"/>
                        <div>
                            <p className="font-semibold text-gray-800">{post.authorName}</p>
                            <p className="text-sm text-gray-500">{formatDateTime(post.timestamp)}</p>
                        </div>
                    </div>
                    <div className="prose max-w-none mt-6 text-gray-700">
                        <p>{post.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>)}
                    </div>
                </div>

                {/* Replies Section */}
                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                         <ChatBubbleLeftRightIcon className="h-6 w-6" />
                         Replies ({post.replies.length})
                    </h2>
                    {post.replies.length > 0 ? (
                        <ul className="space-y-6">
                            {post.replies.map(reply => (
                                <li key={reply.id} className="flex items-start space-x-4">
                                    <img src={reply.authorPhotoUrl} alt={reply.authorName} className="h-10 w-10 rounded-full object-cover" />
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800">{reply.authorName}</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(reply.timestamp)}</p>
                                        </div>
                                        <p className="mt-2 text-gray-700">{reply.content}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No replies yet. Be the first to comment!</p>
                    )}
                </div>

                {/* Add Reply Form */}
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-bold text-gray-800">Leave a Reply</h3>
                    <form onSubmit={handleSubmitReply} className="mt-4 flex items-start space-x-4">
                         <img src={user.profilePhotoUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                         <div className="flex-1">
                            <textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Write your reply here..."
                                rows={4}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button type="submit" className="mt-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                                Post Reply
                            </button>
                         </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForumPostPage;