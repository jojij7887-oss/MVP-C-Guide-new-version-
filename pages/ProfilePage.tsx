import React, { useState, useRef } from 'react';
import { User } from '../types';
import TwoFactorAuthModal from '../components/TwoFactorAuthModal';
import ImageUploader from '../src/components/ImageUploader';

interface ProfilePageProps {
    user: User;
    onUpdateProfile: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone || '');
    const [photoUrl, setPhotoUrl] = useState(user.profilePhotoUrl || '');
    const [password, setPassword] = useState('');
    const [is2faModalOpen, setIs2faModalOpen] = useState(false);
    
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setPhone(numericValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password) {
            setIs2faModalOpen(true);
        } else {
            onUpdateProfile({ ...user, name, email, phone, profilePhotoUrl: photoUrl });
            alert('Profile updated successfully!');
        }
    };
    
    const handle2faSuccess = () => {
        setIs2faModalOpen(false);
        onUpdateProfile({ ...user, name, email, phone, profilePhotoUrl: photoUrl });
        alert('Profile and password updated successfully!');
        setPassword('');
    };
    
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="mt-1 text-gray-600">Update your personal information.</p>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <ImageUploader 
            label="Profile Photo"
            folderKey="Student_Profile"
            currentImageUrl={photoUrl}
            onUploadSuccess={(url) => setPhotoUrl(url)}
            id={user.id}
            fieldName="profilePhotoUrl"
        />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} placeholder="Enter your phone number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" id="role" value={user.role} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500" />
        </div>
        <div className="pt-4 text-right">
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                Save Changes
            </button>
        </div>
      </form>

      {is2faModalOpen && (
        <TwoFactorAuthModal 
            email={user.email}
            onClose={() => setIs2faModalOpen(false)}
            onSuccess={handle2faSuccess}
        />
      )}
    </div>
  );
};

export default ProfilePage;
