
import React, { useState, useEffect, useMemo } from 'react';
import { College, CollegeAd } from '../../types';
import { PencilIcon, TrashIcon, PlayCircleIcon } from '../../components/icons';

// --- Reusable Components ---

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`${
      enabled ? 'bg-indigo-600' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    aria-pressed={enabled}
  >
    <span
      aria-hidden="true"
      className={`${
        enabled ? 'translate-x-5' : 'translate-x-0'
      } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

const AdPreviewCard: React.FC<{ ad: Partial<CollegeAd> }> = ({ ad }) => {
    const categoryColors: Record<CollegeAd['category'], string> = {
        Courses: 'bg-blue-100 text-blue-800',
        Events: 'bg-purple-100 text-purple-800',
        Achievements: 'bg-green-100 text-green-800',
        Notices: 'bg-yellow-100 text-yellow-800',
        Others: 'bg-gray-100 text-gray-800',
    };
    const isVideo = ad.mediaType === 'video';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-sm mx-auto border">
            {ad.mediaUrl && (
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                    {isVideo ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            <video key={ad.mediaUrl} muted loop className="h-full w-full object-cover"><source src={ad.mediaUrl} /></video>
                            <PlayCircleIcon className="absolute h-12 w-12 text-white opacity-75" />
                        </div>
                    ) : (
                        <img src={ad.mediaUrl} alt="Ad preview" className="h-full w-full object-cover" />
                    )}
                </div>
            )}
            <div className="p-4">
                 <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[ad.category || 'Courses']}`}>
                    {ad.category || 'Category'}
                </span>
                <h3 className="font-bold text-lg text-gray-800 truncate mt-2">{ad.title || 'Ad Title'}</h3>
                <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{ad.description || 'Ad description will appear here.'}</p>
                {ad.targetLink && (
                    <a href={ad.targetLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold text-indigo-600 hover:underline">
                        Learn More &rarr;
                    </a>
                )}
            </div>
        </div>
    );
};


// --- Main Component ---

interface ManageCollegeAdsPageProps {
  college: College;
  onUpdate: (collegeId: string, ads: CollegeAd[]) => void;
}

const initialFormState: Partial<CollegeAd> = {
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    targetLink: '',
    category: 'Courses',
    status: 'Active',
};

const ManageCollegeAdsPage: React.FC<ManageCollegeAdsPageProps> = ({ college, onUpdate }) => {
    const [formState, setFormState] = useState<Partial<CollegeAd>>(initialFormState);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const ads = useMemo(() => college.collegeAds || [], [college.collegeAds]);

    useEffect(() => {
        return () => { if (filePreview) URL.revokeObjectURL(filePreview); };
    }, [filePreview]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.title) newErrors.title = 'Ad Title is required.';
        if (formState.targetLink && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(formState.targetLink)) {
            newErrors.targetLink = 'Please enter a valid URL (e.g., https://example.com).';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                setErrors(prev => ({ ...prev, mediaUrl: 'File size cannot exceed 10MB.'}));
                return;
            }
            const mediaType = file.type.startsWith('video') ? 'video' : 'image';
            const preview = URL.createObjectURL(file);
            setFilePreview(preview);
            setFormState(prev => ({ ...prev, mediaUrl: preview, mediaType }));
            setErrors(prev => ({ ...prev, mediaUrl: ''}));
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setFormState(initialFormState);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        setErrors({});
    };

    const handleSave = () => {
        if (!validateForm()) return;

        let updatedAds: CollegeAd[];
        if (isEditing) {
            updatedAds = ads.map(ad => ad.id === isEditing ? { ...ad, ...formState } as CollegeAd : ad);
        } else {
            const newAd: CollegeAd = {
                ...initialFormState,
                ...formState,
                id: `cad-${Date.now()}`,
            } as CollegeAd;
            updatedAds = [...ads, newAd];
        }
        onUpdate(college.id, updatedAds);
        handleCancel();
    };

    const handleEdit = (ad: CollegeAd) => {
        setIsEditing(ad.id);
        setFormState(ad);
        setFilePreview(null);
    };

    const handleDelete = (adId: string) => {
        if (window.confirm('Are you sure you want to delete this ad?')) {
            onUpdate(college.id, ads.filter(ad => ad.id !== adId));
        }
    };
    
    const statusColors = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800',
    };

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload College Ad</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <form className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">{isEditing ? 'Edit Ad' : 'Create New Ad'}</h2>
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Ad Title*</label>
                    <input type="text" name="title" id="title" value={formState.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image/Video (Optional)</label>
                    <input type="file" onChange={handleFileChange} accept="image/jpeg,image/png,video/mp4" className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, MP4. Max 10MB.</p>
                    {errors.mediaUrl && <p className="text-red-500 text-xs mt-1">{errors.mediaUrl}</p>}
                </div>

                <textarea name="description" value={formState.description} onChange={handleChange} placeholder="Description (optional)" rows={3} className="w-full border-gray-300 rounded-md shadow-sm"/>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="targetLink" className="block text-sm font-medium text-gray-700">Target Link</label>
                        <input type="url" name="targetLink" id="targetLink" value={formState.targetLink} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        {errors.targetLink && <p className="text-red-500 text-xs mt-1">{errors.targetLink}</p>}
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" id="category" value={formState.category} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                            <option>Courses</option>
                            <option>Events</option>
                            <option>Achievements</option>
                            <option>Notices</option>
                            <option>Others</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <ToggleSwitch enabled={formState.status === 'Active'} onChange={enabled => setFormState({...formState, status: enabled ? 'Active' : 'Inactive'})}/>
                    </div>
                     <div className="flex items-center gap-2">
                        <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="button" onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">{isEditing ? 'Update Ad' : 'Save Ad'}</button>
                    </div>
                </div>
            </form>

            <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-semibold text-center">Ad Preview</h2>
                <AdPreviewCard ad={{...formState, mediaUrl: filePreview || formState.mediaUrl}} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Uploaded College Ads</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ads.map(ad => (
                            <tr key={ad.id}>
                                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{ad.title}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{ad.category}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ad.status]}`}>{ad.status}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => handleEdit(ad)} className="text-indigo-600 hover:text-indigo-900 flex-inline items-center gap-1"><PencilIcon className="h-4 w-4 inline-block"/> Edit</button>
                                    <button onClick={() => handleDelete(ad.id)} className="text-red-600 hover:text-red-900 flex-inline items-center gap-1"><TrashIcon className="h-4 w-4 inline-block"/> Delete</button>
                                </td>
                            </tr>
                        ))}
                         {ads.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No college ads have been uploaded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ManageCollegeAdsPage;