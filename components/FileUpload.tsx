import React, { useState, useRef, useEffect } from 'react';
import { CloudArrowUpIcon } from './icons';

interface FileUploadProps {
    label: string;
    currentUrl: string;
    accept: string;
    onUploadSuccess: (newUrl: string) => void;
    setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, currentUrl, accept, onUploadSuccess, setNotification }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Revoke old object URL if it exists
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        // Create a local preview
        const localPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(localPreviewUrl);
        setUploading(true);
        setNotification(null);

        // Simulate upload
        const formData = new FormData();
        formData.append('media', file);

        try {
            // In a real app, this would be your backend endpoint
            // e.g., const response = await fetch('http://localhost:3001/upload', { method: 'POST', body: formData });
            // const data = await response.json();
            // if (!response.ok) throw new Error(data.message || 'Upload failed');
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            
            // This is a mocked response. A real backend (like the one in `backend_example.js`) would provide the URL.
            const mockUrl = `/uploads/mock-${file.name}`; 
            
            onUploadSuccess(mockUrl);
            setNotification({ type: 'success', message: `${label} uploaded successfully! Your changes will be auto-saved.` });

        } catch (error) {
            console.error('Upload error:', error);
            setNotification({ type: 'error', message: `Failed to upload ${label}. Please try again.` });
            setPreviewUrl(null); // Clear preview on error
        } finally {
            setUploading(false);
        }
    };

    const mediaUrl = previewUrl || currentUrl;
    const fileType = mediaUrl?.split('.').pop()?.toLowerCase() || '';
    const isVideo = ['mp4'].includes(fileType) || (previewUrl && previewUrl.startsWith('blob:') && accept.includes('video'));

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex items-center space-x-6">
                <div className="flex-shrink-0 h-24 w-40 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
                    {mediaUrl ? (
                        isVideo ? (
                           <video key={mediaUrl} controls autoPlay muted loop className="h-full w-full object-cover">
                               <source src={mediaUrl} />
                           </video>
                        ) : (
                           <img src={mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                        )
                    ) : (
                        <span className="text-sm text-gray-500">No media</span>
                    )}
                </div>
                <div className="flex-grow">
                    <input
                        type="file"
                        accept={accept}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                        {uploading ? 'Uploading...' : 'Change'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Supports: {accept.split(',').map(s => s.split('/')[1]).join(', ').toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
