import React, { useState, useRef, useEffect } from 'react';
import { uploadImageToGoogleDrive, saveUrlToSheet, verifyUrlInSheet } from '../utils/uploadService';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../../components/icons';

interface ImageUploaderProps {
  label: string;
  folderKey: string;
  onUploadSuccess: (url: string) => void;
  id: string;
  fieldName: string;
  currentImageUrl?: string;
  shape?: 'circle' | 'square';
}

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';
type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

function formatDistanceToNow(date: Date | null): string | null {
    if (!date) return null;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
}

const StatusBadge: React.FC<{ syncStatus: SyncStatus; onRetry?: () => void }> = ({ syncStatus, onRetry }) => {
  if (syncStatus === 'synced') {
    return (
      <div className="absolute top-0 right-0 -m-1 bg-green-500 text-white rounded-full p-1 border-2 border-white" title="Verified & Synced">
        <CheckCircleIcon className="h-4 w-4" />
      </div>
    );
  }
  if (syncStatus === 'failed') {
    return (
      <button onClick={onRetry} className="absolute top-0 right-0 -m-1 bg-red-500 text-white rounded-full p-1 border-2 border-white cursor-pointer hover:bg-red-600" title="Sync Failed – Tap to Retry">
        <ExclamationTriangleIcon className="h-4 w-4" />
      </button>
    );
  }
  if (syncStatus === 'syncing') {
    return (
      <div className="absolute top-0 right-0 -m-1 bg-yellow-500 text-white rounded-full p-1 border-2 border-white" title="Pending Sync">
        <div className="h-4 w-4 animate-pulse bg-yellow-300 rounded-full"></div>
      </div>
    );
  }
  return null;
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ label, folderKey, onUploadSuccess, id, fieldName, currentImageUrl, shape = 'circle' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentImageUrl || null);
    if (currentImageUrl) {
        setUploadStatus('success');
        setSyncStatus('synced');
        setLastSynced(new Date()); 
    } else {
        setUploadStatus('idle');
        setSyncStatus('idle');
    }
  }, [currentImageUrl]);

  useEffect(() => {
    const localPreview = preview;
    if (localPreview && localPreview.startsWith('blob:')) {
      return () => URL.revokeObjectURL(localPreview);
    }
  }, [preview]);

  const verifyAndRetry = async (url: string, retryCount = 0): Promise<void> => {
    console.log(`Verification attempt #${retryCount + 1} for ${fieldName}`);
    setSyncStatus('syncing');
    setMessage('Verifying sync...');

    await new Promise(res => setTimeout(res, 2000)); // Wait for sheet to update

    try {
        const isVerified = await verifyUrlInSheet(id, fieldName, url);
        if (isVerified) {
            console.log("Upload → Drive → Sheet → Verified");
            setSyncStatus('synced');
            setLastSynced(new Date());
            setMessage('✅ Verified & Synced!');
            return;
        }

        if (retryCount < 2) { // Max 3 attempts
            console.log(`Verification failed, retrying to save URL...`);
            setMessage(`Sync failed, retrying... (${retryCount + 2}/3)`);
            await saveUrlToSheet(id, fieldName, url);
            await verifyAndRetry(url, retryCount + 1);
        } else {
            throw new Error("Sync failed after 3 attempts.");
        }
    } catch (error) {
        console.error(error);
        setSyncStatus('failed');
        setMessage('⚠️ Sync Failed – Tap to Retry');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadStatus('selected');
      setSyncStatus('idle');
      setMessage('');
      setProgress(0);
      setLastSynced(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }
    setUploadStatus('uploading');
    setMessage('Uploading...');
    
    const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 10, 95)), 300);

    try {
      const newUrl = await uploadImageToGoogleDrive(file, folderKey, id, fieldName);
      clearInterval(interval);
      setProgress(100);
      setUploadStatus('success');
      onUploadSuccess(newUrl);
      setUploadedUrl(newUrl);
      
      await verifyAndRetry(newUrl);

    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setUploadStatus('error');
      setSyncStatus('failed');
      setMessage(`❌ Upload failed – check connection or permissions.`);
      setPreview(currentImageUrl || null);
      console.error(error);
    }
  };
  
  const imageContainerClasses = `relative w-24 h-24 ${shape === 'circle' ? 'rounded-full' : 'rounded-md'}`;
  const imageClasses = `w-full h-full object-cover ${shape === 'circle' ? 'rounded-full' : 'rounded-md'}`;
  const placeholderImage = 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex items-center space-x-6">
        <div className={imageContainerClasses}>
          <img 
            src={preview || placeholderImage} 
            alt="Preview" 
            className={imageClasses}
          />
          <StatusBadge syncStatus={syncStatus} onRetry={() => uploadedUrl && verifyAndRetry(uploadedUrl)} />
           {uploadStatus === 'uploading' && (
            <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center ${shape === 'circle' ? 'rounded-full' : 'rounded-md'}`}>
                <ArrowPathIcon className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
               disabled={uploadStatus === 'uploading'}
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm disabled:opacity-50"
            >
              Choose Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {uploadStatus === 'selected' && (
                <button
                type="button"
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium"
                >
                Upload
                </button>
            )}
          </div>
          {uploadStatus === 'uploading' && (
             <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          {message && <p className={`text-sm break-words ${uploadStatus === 'error' || syncStatus === 'failed' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          {syncStatus === 'synced' && lastSynced && <p className="text-xs text-gray-500">Synced: {formatDistanceToNow(lastSynced)}</p>}
        </div>
      </div>
    </div>
  );
};
export default ImageUploader;