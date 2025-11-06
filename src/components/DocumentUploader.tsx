import React, { useState } from 'react';
import { uploadImageToGoogleDrive, saveUrlToSheet, verifyUrlInSheet } from '../utils/uploadService';
import { CheckCircleIcon, DocumentIcon, ExclamationTriangleIcon } from '../../components/icons';

interface DocumentUploaderProps {
  label: string;
  folderKey: string;
  onUploadSuccess: (url: string) => void;
  id: string;
  fieldName: string;
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

const StatusBadge: React.FC<{ syncStatus: SyncStatus, onRetry?: () => void }> = ({ syncStatus, onRetry }) => {
  if (syncStatus === 'synced') {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
        <CheckCircleIcon className="h-4 w-4" />
        Verified
      </span>
    );
  }
  if (syncStatus === 'failed') {
     return (
      <button onClick={onRetry} className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full cursor-pointer hover:bg-red-200">
        <ExclamationTriangleIcon className="h-4 w-4" />
        Sync Failed – Tap to Retry
      </button>
    );
  }
   if (syncStatus === 'syncing') {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
        <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Syncing...
      </span>
    );
  }
  return (
      <span className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
        Pending Upload
      </span>
  );
};


const DocumentUploader: React.FC<DocumentUploaderProps> = ({ label, folderKey, onUploadSuccess, id, fieldName }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const verifyAndRetry = async (url: string, retryCount = 0): Promise<void> => {
    console.log(`Verification attempt #${retryCount + 1} for ${fieldName}`);
    setSyncStatus('syncing');
    setMessage('Verifying sync...');

    await new Promise(res => setTimeout(res, 2000));

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
      setFile(e.target.files[0]);
      setUploadStatus('selected');
      setSyncStatus('idle');
      setMessage('');
      setUploadedUrl(null);
      setProgress(0);
      setLastSynced(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setMessage('Uploading...');
    
    const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 10, 95)), 300);

    try {
      const newUrl = await uploadImageToGoogleDrive(file, folderKey, id, fieldName);
      clearInterval(interval);
      setProgress(100);
      setUploadStatus('success');
      setUploadedUrl(newUrl);
      onUploadSuccess(newUrl);

      await verifyAndRetry(newUrl);
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setUploadStatus('error');
      setSyncStatus('failed');
      setMessage(`❌ Upload failed – check connection or permissions.`);
      console.error(error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 p-4 border-2 border-gray-300 border-dashed rounded-md space-y-3">
        <div className="flex items-center space-x-4">
           <div className="flex-shrink-0">
                <DocumentIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-grow min-w-0">
                <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                {file && <p className="text-xs text-gray-600 mt-1 truncate">Selected: {file.name}</p>}
            </div>
        </div>
        
        {uploadStatus !== 'idle' && (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <StatusBadge syncStatus={syncStatus} onRetry={() => uploadedUrl && verifyAndRetry(uploadedUrl)} />
                    {(uploadStatus === 'selected' || uploadStatus === 'uploading') && (
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploadStatus !== 'selected'}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium disabled:bg-gray-400"
                        >
                            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                        </button>
                    )}
                </div>

                {uploadStatus === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                 {message && <p className={`text-sm break-all ${uploadStatus === 'error' || syncStatus === 'failed' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                 {syncStatus === 'synced' && lastSynced && <p className="text-xs text-gray-500">Synced: {formatDistanceToNow(lastSynced)}</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;