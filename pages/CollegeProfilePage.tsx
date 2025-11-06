import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, College } from '../types';
import { StarIcon, SparklesIcon, ChevronRightIcon } from '../components/icons';
import BackButton from '../components/BackButton';

const ComingSoonCard: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center h-full flex flex-col justify-center items-center">
        <span className="text-4xl" role="img" aria-label="icon">{icon}</span>
        <h3 className="mt-4 text-xl font-bold text-gray-700">{title}</h3>
        <p className="mt-2 text-gray-500">Coming Soon</p>
        <p className="text-sm text-gray-400">This feature is under development and will be available shortly.</p>
    </div>
);


interface CollegeProfilePageProps {
  user: User;
  onToggleFavorite: (collegeId: string) => void;
  onToggleFavoriteCourse: (courseId: string) => void;
  colleges: College[];
}

const CollegeProfilePage: React.FC<CollegeProfilePageProps> = ({ user, onToggleFavorite, onToggleFavoriteCourse, colleges }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const college = colleges.find(c => c.id === id);
  
  if (!college) {
    return <div className="text-center text-red-500 text-xl">College not found.</div>;
  }
  
  const isFavorite = user.favoriteCollegeIds.includes(college.id);

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Banner and Logo */}
        <div className="relative">
          <img className="h-64 w-full object-cover" src={college.photoUrl} alt={`${college.name} banner`} />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
          {college.isFeatured && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
              <SparklesIcon className="h-5 w-5" />
              <span>FEATURED</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6 md:p-8 flex items-end space-x-6">
            <img className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-lg" src={college.logoUrl} alt={`${college.name} logo`} />
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white shadow-text">{college.name}</h1>
                 <button
                    onClick={() => onToggleFavorite(college.id)}
                    className={`p-3 rounded-full transition-colors ${isFavorite ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-gray-200 bg-opacity-30 text-white hover:bg-opacity-50'}`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <StarIcon className="h-6 w-6" solid={isFavorite}/>
                </button>
              </div>
              <p className="text-lg text-gray-200 shadow-text">{college.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{college.description}</p>
            </section>
            
            {/* Admission Timeline Section */}
            <section className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Admission Timeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-6">
                    <div className="p-4 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-gray-500">📅 Admission Opens</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(college.admissionOpenDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-gray-500">⏳ Admission Closes</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(college.admissionCloseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
                <div className="text-center">
                    <button
                        onClick={() => navigate(`/apply/${college.id}`)}
                        className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        🎓 Apply Now
                    </button>
                </div>
            </section>

            {/* Courses Offered */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Courses Offered</h2>
              <div className="space-y-4">
                {college.courses.map(course => {
                  const hasSeats = course.totalSeats && course.totalSeats > 0;
                  const availableSeats = hasSeats ? course.totalSeats! - course.enrollmentCount : 0;
                  const occupancy = hasSeats ? (course.enrollmentCount / course.totalSeats!) * 100 : 0;
                  const fewSeatsLeft = hasSeats && availableSeats > 0 && availableSeats <= course.totalSeats! * 0.1;
                  
                  let progressColor = 'bg-green-500';
                  if (occupancy > 90) progressColor = 'bg-orange-500';
                  if (occupancy >= 100) progressColor = 'bg-red-500';

                  return (
                      <Link
                        key={course.id}
                        to={`/college/${college.id}/course/${course.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-start flex-wrap">
                            <div className="flex-grow pr-4 w-full sm:w-auto">
                               <div className="flex items-center gap-3">
                                   <h3 className="text-xl font-semibold text-indigo-700">{course.name}</h3>
                                   {course.isPremium && (
                                       <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">PREMIUM</span>
                                   )}
                               </div>
                               <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                   <span>Duration: {course.duration}</span>
                                   <span>|</span>
                                   <span>Fees: {course.fees}</span>
                               </div>
                               <p className="mt-2 text-sm font-medium text-gray-700">Eligibility: <span className="font-normal text-gray-600">{course.eligibility || 'Not specified'}</span></p>
                              {hasSeats && (
                               <div className="w-full mt-3">
                                   <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                       <span>{availableSeats > 0 ? `${availableSeats} of ${course.totalSeats} seats available` : `0 of ${course.totalSeats} seats available`}</span>
                                       <span>{occupancy.toFixed(0)}% Full</span>
                                   </div>
                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                                       <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                                   </div>
                                   {fewSeatsLeft && (
                                       <p className="text-sm font-bold text-orange-600 mt-2">Urgent: Only {availableSeats} seats remaining!</p>
                                   )}
                               </div>
                              )}
                            </div>
                             <div className="flex items-center flex-shrink-0 mt-2 sm:mt-0">
                                <span className="text-sm font-semibold text-indigo-600 group-hover:underline">View Details <ChevronRightIcon className="inline h-4 w-4" /></span>
                            </div>
                        </div>
                      </Link>
                  );
                })}
              </div>
            </section>

            {/* Events Section -- UPDATED to Coming Soon */}
            <section>
              <ComingSoonCard icon="🏫" title="Events & Campus Life" />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Ads Section -- UPDATED to Coming Soon */}
            <ComingSoonCard icon="📢" title="Featured Ads" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfilePage;