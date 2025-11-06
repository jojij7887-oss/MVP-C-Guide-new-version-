import React from 'react';
import { useNavigate } from 'react-router-dom';
import { College, CollegeEvent } from '../../types';
import ComingSoonWidget from '../../components/ComingSoonWidget';

interface ManageEventsPageProps {
    college: College;
    onUpdate: (collegeId: string, events: CollegeEvent[]) => void;
}

const ManageEventsPage: React.FC<ManageEventsPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <ComingSoonWidget onReturn={() => navigate('/admin/dashboard')} />
    </div>
  );
};

export default ManageEventsPage;
