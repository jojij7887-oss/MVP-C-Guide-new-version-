import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ForumPost } from '../types';
import BackButton from '../components/BackButton';

interface CreateForumPostPageProps {
  user: User;
  onAddPost: (postData: Omit<ForumPost, 'id' | 'views' | 'replies' | 'lastActivity'>) => void;
}

const CreateForumPostPage: React.FC<CreateForumPostPageProps> = ({ user, onAddPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }

        const newPostData = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            authorId: user.id,
            authorName: user.name,
            authorPhotoUrl: user.profilePhotoUrl,
            timestamp: new Date().toISOString(),
        };
        onAddPost(newPostData);
        navigate('/community-forum');
    };
    
    return (
        <div className="space-y-6">
            <BackButton />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900">Create a New Post</h1>
                <p className="mt-1 text-gray-600">Share your thoughts with the community.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={8}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., Admissions, Campus Life, Computer Science"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                         <p className="text-xs text-gray-500 mt-1">Separate tags with a comma.</p>
                    </div>
                    <div className="pt-4 text-right">
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateForumPostPage;