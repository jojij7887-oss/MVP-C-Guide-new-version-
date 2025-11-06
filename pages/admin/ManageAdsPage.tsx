import React from 'react';
import { useNavigate } from 'react-router-dom';
import { College, FeaturedAd } from '../../types';
import ComingSoonWidget from '../../components/ComingSoonWidget';

interface ManageAdsPageProps {
  college: College;
  onUpdate: (collegeId: string, ads: FeaturedAd[]) => void;
}

const ManageAdsPage: React.FC<ManageAdsPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <ComingSoonWidget onReturn={() => navigate('/admin/dashboard')} />
    </div>
  );
};

export default ManageAdsPage;