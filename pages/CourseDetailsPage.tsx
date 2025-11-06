import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, College, Course } from '../types';
import BackButton from '../components/BackButton';
import { StarIcon } from '../components/icons';

// Reusable component for admission status
const AdmissionStatusBadge: React.FC<{ course: Course }> = ({ course }) => {
    const today = new Date().toISOString().split('T')[0];
    let status: 'Open' | 'Closed' | 'Upcoming' | 'Full' | 'Unknown' = 'Unknown';
    const isFull = course.totalSeats && course.enrollmentCount >= course.totalSeats;

    if (isFull) {
        status = 'Full';
    } else if (course.admissionOpenDate && course.admissionEndDate) {
        if (today < course.admissionOpenDate) {
            status = 'Upcoming';
        } else if (today > course.admissionEndDate) {
            status = 'Closed';
        } else {
            status = 'Open';
        }
    }

    const statusStyles = {
        Open: 'bg-green-100 text-green-800',
        Closed: 'bg-red-100 text-red-800',
        Upcoming: 'bg-blue-100 text-blue-800',
        Full: 'bg-yellow-100 text-yellow-800',
        Unknown: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};


interface CourseDetailsPageProps {
  user: User;
  colleges: College[];
  onToggleFavoriteCourse: (courseId: string) => void;
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ user, colleges, onToggleFavoriteCourse }) => {
  const { collegeId, courseId } = useParams<{ collegeId: string; courseId: string }>();
  const navigate = useNavigate();

  const college = colleges.find(c => c.id === collegeId);
  const course = college?.courses.find(c => c.id === courseId);

  if (!college || !course) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>
        <p className="text-gray-500 mt-2">The course you are looking for does not exist or has been moved.</p>
        <BackButton className="mt-6" />
      </div>
    );
  }

  const isFavorite = user.favoriteCourseIds.includes(course.id);
  const hasSeats = course.totalSeats && course.totalSeats > 0;
  const availableSeats = hasSeats ? course.totalSeats! - course.enrollmentCount : 0;
  const occupancy = hasSeats ? (course.enrollmentCount / course.totalSeats!) * 100 : 0;
  const isFull = hasSeats && availableSeats <= 0;
  
  let progressColor = 'bg-green-500';
  if (occupancy > 90) progressColor = 'bg-orange-500';
  if (occupancy >= 100) progressColor = 'bg-red-500';

  // Determine which admission dates to display: course-specific or fallback to college-level.
  // In a real app, these dates would be sourced from your 'Courses' and 'Colleges' sheets.
  const openDate = course.admissionOpenDate || college.admissionOpenDate;
  const closeDate = course.admissionEndDate || college.admissionCloseDate;

  // Determine the appropriate label based on the date source.
  const openDateLabel = course.admissionOpenDate ? "Course Admission Opens:" : "College Admission Opens:";
  const closeDateLabel = course.admissionEndDate ? "Course Admission Closes:" : "College Admission Closes:";


  return (
    <div className="space-y-6">
      <BackButton />
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <Link to={`/college/${college.id}`} className="text-indigo-600 font-semibold hover:underline">{college.name}</Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">{course.name}</h1>
                </div>
                <button
                    onClick={() => onToggleFavoriteCourse(course.id)}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <StarIcon className={`h-6 w-6 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`} solid={isFavorite}/>
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left border-t border-b py-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-gray-800">{course.duration}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Fees</p>
                    <p className="text-lg font-semibold text-gray-800">{course.fees}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Admission Status</p>
                    <div className="mt-1 flex justify-center md:justify-start">
                        <AdmissionStatusBadge course={course} />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">About this Course</h2>
                        <p className="text-gray-700 leading-relaxed">{course.description}</p>
                    </section>
                     <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Eligibility</h2>
                        <p className="text-gray-700">{course.eligibility || 'Please contact the college for eligibility details.'}</p>
                    </section>
                </div>
                
                <aside>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-5">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Admission Timeline</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-600">{openDateLabel}</span>
                                    <span className="text-gray-800 font-medium">{openDate ? new Date(openDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-600">{closeDateLabel}</span>
                                    <span className="text-gray-800 font-medium">{closeDate ? new Date(closeDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {hasSeats && (
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">Seat Availability</h3>
                                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                    <span>{availableSeats > 0 ? `${availableSeats} seats available` : `0 seats available`}</span>
                                    <span>{occupancy.toFixed(0)}% Full</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => navigate(`/apply/${college.id}`, { state: { selectedCourseId: course.id } })}
                            disabled={isFull}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title={isFull ? "Admissions are full for this course" : "Apply for this course"}
                        >
                            {isFull ? 'Seats Full' : 'Apply Now'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;