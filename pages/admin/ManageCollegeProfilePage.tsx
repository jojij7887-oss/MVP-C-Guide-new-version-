import React, { useState, useEffect } from 'react';
import { College, User } from '../../types';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '../../components/icons';
import ImageUploader from '../../src/components/ImageUploader';

interface ManageCollegeProfilePageProps {
  college: College;
  admin: User;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={id} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea id={id} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const NotificationBanner: React.FC<{ type: 'success' | 'error'; message: string; onDismiss: () => void; }> = ({ type, message, onDismiss }) => {
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
    const textColor = isSuccess ? 'text-green-700' : 'text-red-700';
    const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

    return (
        <div className={`mb-6 p-4 border-l-4 rounded-r-lg ${bgColor} ${textColor}`} role="alert">
            <div className="flex">
                <div className="py-1"><Icon className="h-5 w-5 mr-3" /></div>
                <div>
                    <p className="font-bold">{isSuccess ? 'Success' : 'Error'}</p>
                    <p className="text-sm">{message}</p>
                </div>
                 <button onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 inline-flex h-8 w-8" aria-label="Dismiss">
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

const ManageCollegeProfilePage: React.FC<ManageCollegeProfilePageProps> = ({ college, admin }) => {
    const [collegeData, setCollegeData] = useState({
        collegeName: college.name || '',
        location: college.location || '',
        phone: college.phone || '',
        email: 'info@apex.edu',
        applicationFee: college.admissionFee?.toString() || '',
        upiId: college.upiId || '',
        bannerUrl: college.photoUrl || '',
        logoUrl: college.logoUrl || '',
        shortDescription: college.shortDescription || '',
        fullDescription: college.description || '',
    });

    const [adminData, setAdminData] = useState({
        fullName: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        profilePhotoUrl: admin.profilePhotoUrl || '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setCollegeData({
            collegeName: college.name,
            location: college.location,
            phone: college.phone,
            email: 'info@apex.edu',
            applicationFee: college.admissionFee?.toString() || '',
            upiId: college.upiId || '',
            bannerUrl: college.photoUrl,
            logoUrl: college.logoUrl,
            shortDescription: college.shortDescription,
            fullDescription: college.description,
        });
        setAdminData({
            fullName: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            profilePhotoUrl: admin.profilePhotoUrl || '',
        });
    }, [college, admin]);


    const handleCollegeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCollegeData({ ...collegeData, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        const payload = {
            type: "college",
            data: {
                collegeName: collegeData.collegeName,
                location: collegeData.location,
                email: collegeData.email,
                phone: collegeData.phone,
                applicationFee: collegeData.applicationFee,
                upiID: collegeData.upiId,
                bannerURL: collegeData.bannerUrl,
                logoURL: collegeData.logoUrl,
                shortDescription: collegeData.shortDescription,
                fullDescription: collegeData.fullDescription,
                adminName: adminData.fullName,
                adminEmail: adminData.email,
                adminPhone: adminData.phone,
                adminPhotoURL: adminData.profilePhotoUrl,
                role: "COLLEGE_ADMIN",
                timestamp: new Date().toISOString(),
            },
        };

        try {
            const response = await fetch("https://hook.eu2.make.com/bn1oo8rgmvck2q59iicdtmmq2ujygpqe", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setNotification({ message: 'Profile saved successfully!', type: 'success' });
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to save profile: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error(error);
            setNotification({ message: (error as Error).message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            {notification && (
                <NotificationBanner 
                    type={notification.type} 
                    message={notification.message} 
                    onDismiss={() => setNotification(null)} 
                />
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage College & Admin Profile</h1>

            <form onSubmit={handleSaveChanges} className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">🏫 College Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="College Name" id="collegeName" name="collegeName" value={collegeData.collegeName} onChange={handleCollegeChange} />
                        <InputField label="Location" id="location" name="location" value={collegeData.location} onChange={handleCollegeChange} />
                        <InputField label="Contact Phone" id="phone" name="phone" type="tel" value={collegeData.phone} onChange={handleCollegeChange} />
                        <InputField label="Contact Email" id="email" name="email" type="email" value={collegeData.email} onChange={handleCollegeChange} />
                        <InputField label="Application Fee (INR)" id="applicationFee" name="applicationFee" type="number" value={collegeData.applicationFee} onChange={handleCollegeChange} />
                        <InputField label="UPI ID" id="upiId" name="upiId" value={collegeData.upiId} onChange={handleCollegeChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                       <ImageUploader 
                            label="College Banner"
                            folderKey="College_Banner"
                            currentImageUrl={collegeData.bannerUrl}
                            onUploadSuccess={(url) => setCollegeData(prev => ({...prev, bannerUrl: url}))}
                            shape="square"
                            id={college.id}
                            fieldName="bannerUrl"
                       />
                       <ImageUploader 
                            label="College Logo"
                            folderKey="College_Logo"
                            currentImageUrl={collegeData.logoUrl}
                            onUploadSuccess={(url) => setCollegeData(prev => ({...prev, logoUrl: url}))}
                            shape="square"
                            id={college.id}
                            fieldName="logoUrl"
                       />
                    </div>
                    <TextAreaField label="Short Description" id="shortDescription" name="shortDescription" value={collegeData.shortDescription} onChange={handleCollegeChange} rows={2} />
                    <TextAreaField label="Full Description" id="fullDescription" name="fullDescription" value={collegeData.fullDescription} onChange={handleCollegeChange} rows={4} />
                </section>

                <hr className="my-8"/>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">👤 Admin Details</h2>
                     <ImageUploader 
                        label="Admin Profile Photo"
                        folderKey="Admin_Profile"
                        currentImageUrl={adminData.profilePhotoUrl}
                        onUploadSuccess={(url) => setAdminData(prev => ({...prev, profilePhotoUrl: url}))}
                        id={admin.id}
                        fieldName="profilePhotoUrl"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Admin Full Name" id="fullName" name="fullName" value={adminData.fullName} onChange={handleAdminChange} />
                        <InputField label="Admin Email" id="adminEmail" name="email" type="email" value={adminData.email} onChange={handleAdminChange} />
                        <InputField label="Admin Phone" id="adminPhone" name="phone" type="tel" value={adminData.phone} onChange={handleAdminChange} />
                        <InputField label="Role" id="role" name="role" value="COLLEGE_ADMIN" readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                </section>

                <div className="pt-6 text-right">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageCollegeProfilePage;
