

import React, { useState, useEffect } from 'react';
import { College, Course } from '../../types';
import { CheckCircleIcon, XCircleIcon, XMarkIcon, CalendarDaysIcon } from '../../components/icons';

interface ManageCoursesPageProps {
  college: College;
  onUpdateCourses: (collegeId: string, updatedCourses: Course[]) => void;
  onUpdateCollege: (college: College) => void;
}

type CourseFormData = Omit<Course, 'id' | 'enrollmentCount' | 'isPremium' | 'isNew' | 'admissionOpenDate' | 'admissionEndDate' | 'featuredAd'> & { confirmedAdmissionsOverride: number };

const initialFormState: CourseFormData = {
  name: '',
  duration: '',
  fees: '',
  description: '',
  eligibility: '',
  totalSeats: 0,
  confirmedAdmissionsOverride: 0,
  courseImage: '',
};

const NotificationBanner: React.FC<{ type: 'success' | 'error'; message: string; onDismiss: () => void; }> = ({ type, message, onDismiss }) => {
    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
    const textColor = isSuccess ? 'text-green-700' : 'text-red-700';
    const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

    return (
        <div className={`my-4 p-4 border-l-4 rounded-r-lg ${bgColor} ${textColor}`} role="alert">
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

const AdmissionTimelineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (openDate: string, closeDate: string) => void;
  initialOpenDate: string;
  initialCloseDate: string;
}> = ({ isOpen, onClose, onSave, initialOpenDate, initialCloseDate }) => {
  const [openDate, setOpenDate] = useState(initialOpenDate);
  const [closeDate, setCloseDate] = useState(initialCloseDate);

  useEffect(() => {
    setOpenDate(initialOpenDate);
    setCloseDate(initialCloseDate);
  }, [initialOpenDate, initialCloseDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(openDate, closeDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <header className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Admission Timeline</h2>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="admissionOpenDate" className="block text-sm font-medium text-gray-700">Admission Open Date</label>
            <input 
              type="date" 
              id="admissionOpenDate" 
              value={openDate} 
              onChange={e => setOpenDate(e.target.value)} 
              placeholder="Select opening date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="admissionCloseDate" className="block text-sm font-medium text-gray-700">Admission Close Date</label>
            <input 
              type="date" 
              id="admissionCloseDate" 
              value={closeDate} 
              onChange={e => setCloseDate(e.target.value)} 
              placeholder="Select closing date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </main>
        <footer className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Save Changes</button>
        </footer>
      </div>
    </div>
  );
};


const ManageCoursesPage: React.FC<ManageCoursesPageProps> = ({ college, onUpdateCourses, onUpdateCollege }) => {
    const [courses, setCourses] = useState<Course[]>(college.courses);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formState, setFormState] = useState<CourseFormData>(initialFormState);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setNotification({ type: 'error', message: 'Please upload a valid image file (JPG, PNG).'});
                return;
            }
            if (formState.courseImage && formState.courseImage.startsWith('blob:')) {
                URL.revokeObjectURL(formState.courseImage);
            }
            const imageUrl = URL.createObjectURL(file);
            setFormState(prev => ({ ...prev, courseImage: imageUrl }));
        }
    };

    const handleAddNewClick = () => {
        setEditingCourse(null);
        setFormState(initialFormState);
        setIsFormVisible(true);
        setNotification(null);
    };
    
    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingCourse(null);
        if (formState.courseImage && formState.courseImage.startsWith('blob:')) {
            URL.revokeObjectURL(formState.courseImage);
        }
        setFormState(initialFormState);
        setNotification(null);
    };

    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setFormState({
            name: course.name,
            duration: course.duration,
            fees: course.fees,
            description: course.description,
            eligibility: course.eligibility || '',
            totalSeats: course.totalSeats || 0,
            confirmedAdmissionsOverride: course.enrollmentCount || 0,
            courseImage: course.courseImage || '',
        });
        setIsFormVisible(true);
        setNotification(null);
    };

    const handleSaveCourse = async () => {
        if (!formState.name || !formState.fees || !formState.duration) {
            setNotification({ type: 'error', message: 'Please fill out all required fields.'});
            return;
        }

        setIsLoading(true);
        setNotification(null);
        const webhookUrl = "https://hook.eu2.make.com/e5h7oxluap2vr7nxijuobe7ldpp45s5k";

        const courseID = editingCourse ? editingCourse.id : `COURSE${Date.now()}`;

        const payload = {
            type: "course",
            data: {
                courseID: courseID,
                collegeID: college.id,
                courseName: formState.name,
                duration: formState.duration,
                fees: formState.fees,
                totalSeats: formState.totalSeats,
                confirmedAdmissionsOverride: formState.confirmedAdmissionsOverride,
                description: formState.description,
                eligibilityCriteria: formState.eligibility,
                courseImage: formState.courseImage,
            }
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

            let updatedCourses;
            const { confirmedAdmissionsOverride, ...courseData } = formState;

            if (editingCourse) {
                updatedCourses = courses.map(c => c.id === editingCourse.id ? { 
                    ...c, 
                    ...courseData, 
                    enrollmentCount: confirmedAdmissionsOverride 
                } : c);
            } else {
                const newCourse: Course = { 
                    ...courseData, 
                    id: courseID, 
                    enrollmentCount: confirmedAdmissionsOverride
                };
                updatedCourses = [...courses, newCourse];
            }
            setCourses(updatedCourses);
            onUpdateCourses(college.id, updatedCourses);
            setNotification({ type: 'success', message: '✅ Course saved successfully!' });
            handleCancel();

        } catch (error) {
            console.error("Failed to save course data:", error);
            setNotification({ type: 'error', message: '⚠️ Failed to save course. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTimeline = (openDate: string, closeDate: string) => {
        const updatedCollege: College = {
            ...college,
            admissionOpenDate: openDate,
            admissionCloseDate: closeDate,
        };
        onUpdateCollege(updatedCollege);
        setNotification({ type: 'success', message: 'Admission timeline updated successfully!' });
        setIsTimelineModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsTimelineModalOpen(true)} className="bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5" />
                        Edit Admission Timeline
                    </button>
                    <button onClick={handleAddNewClick} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                        + Add New Course
                    </button>
                </div>
            </div>

            {notification && !isFormVisible && (
                <NotificationBanner 
                    type={notification.type} 
                    message={notification.message} 
                    onDismiss={() => setNotification(null)} 
                />
            )}
            
            {isFormVisible && (
                 <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <h2 className="text-xl font-semibold border-b pb-2">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                    {notification && (
                         <NotificationBanner 
                            type={notification.type} 
                            message={notification.message} 
                            onDismiss={() => setNotification(null)} 
                        />
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input type="text" name="name" id="name" value={formState.name} onChange={handleFormChange} placeholder="e.g. Computer Science" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                            <input type="text" name="duration" id="duration" value={formState.duration} onChange={handleFormChange} placeholder="e.g. 4 Years" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Fees</label>
                            <input type="text" name="fees" id="fees" value={formState.fees} onChange={handleFormChange} placeholder="e.g. 45000" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700">Total Seats</label>
                            <input type="number" name="totalSeats" id="totalSeats" value={formState.totalSeats} onChange={handleFormChange} placeholder="e.g. 120" min="0" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="confirmedAdmissionsOverride" className="block text-sm font-medium text-gray-700">Confirmed Admissions</label>
                            <input type="number" name="confirmedAdmissionsOverride" id="confirmedAdmissionsOverride" value={formState.confirmedAdmissionsOverride} onChange={handleFormChange} placeholder="e.g. 100" min="0" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Image</label>
                        <div className="mt-1 flex items-center gap-4">
                            {formState.courseImage && <img src={formState.courseImage} alt="Preview" className="h-20 w-32 object-cover rounded-md border" />}
                            <input 
                                type="file" 
                                id="courseImage" 
                                onChange={handleFileChange} 
                                accept="image/jpeg, image/png, image/jpg"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Course Description</label>
                        <textarea name="description" id="description" value={formState.description} onChange={handleFormChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                    <div>
                        <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                        <textarea name="eligibility" id="eligibility" value={formState.eligibility} onChange={handleFormChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="button" onClick={handleSaveCourse} disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                            {isLoading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Save Course')}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Course Catalog ({courses.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{course.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{course.duration}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollmentCount} / {course.totalSeats || 'N/A'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleEditClick(course)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <AdmissionTimelineModal
                isOpen={isTimelineModalOpen}
                onClose={() => setIsTimelineModalOpen(false)}
                onSave={handleSaveTimeline}
                initialOpenDate={college.admissionOpenDate.split('T')[0]}
                initialCloseDate={college.admissionCloseDate.split('T')[0]}
            />
        </div>
    );
};

export default ManageCoursesPage;