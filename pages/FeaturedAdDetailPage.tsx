import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { College } from '../types';
import BackButton from '../components/BackButton';
import { PlayCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';

const MediaGallery: React.FC<{ mediaUrls: string[], adTitle: string }> = ({ mediaUrls, adTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? mediaUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === mediaUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const currentMedia = mediaUrls[currentIndex];
    const isVideo = currentMedia.endsWith('.mp4');

    return (
        <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg bg-black">
            {isVideo ? (
                 <video src={currentMedia} controls autoPlay muted loop className="w-full h-full object-contain" />
            ) : (
                <img src={currentMedia} alt={`${adTitle} - slide ${currentIndex + 1}`} className="w-full h-full object-cover" />
            )}
            {mediaUrls.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {mediaUrls.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


const FeaturedAdDetailPage: React.FC<{ colleges: College[] }> = ({ colleges }) => {
    const { collegeId, courseId } = useParams<{ collegeId: string; courseId: string }>();
    const navigate = useNavigate();

    const college = colleges.find(c => c.id === collegeId);
    const course = college?.courses.find(c => c.id === courseId);

    if (!college || !course || !course.featuredAd) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600">Featured Ad Not Found</h2>
                <p className="text-gray-500 mt-2">The promotion you are looking for might have expired or is no longer available.</p>
                <BackButton className="mt-6" />
            </div>
        );
    }
    
    const { featuredAd } = course;
    const hasSeats = course.totalSeats && course.totalSeats > 0;
    const availableSeats = hasSeats ? course.totalSeats! - course.enrollmentCount : 0;
    const occupancy = hasSeats ? (course.enrollmentCount / course.totalSeats!) * 100 : 0;
    
    let progressColor = 'bg-green-500';
    if (occupancy > 90) progressColor = 'bg-orange-500';
    if (occupancy >= 100) progressColor = 'bg-red-500';

    return (
        <div className="space-y-6">
            <BackButton />
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <img src={college.logoUrl} alt={`${college.name} logo`} className="h-16 w-16 rounded-full object-cover border-2 border-gray-100" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{featuredAd.adTitle}</h1>
                            <p className="text-lg text-gray-500">from <Link to={`/college/${college.id}`} className="font-semibold text-indigo-600 hover:underline">{college.name}</Link></p>
                        </div>
                    </div>
                     <div className="flex flex-wrap gap-2 mb-6">
                        {featuredAd.tags.map(tag => (
                            <span key={tag} className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
                
                <MediaGallery mediaUrls={featuredAd.mediaUrls} adTitle={featuredAd.adTitle} />

                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">About This Program</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{featuredAd.adDescription}</p>
                        </section>
                         <section>
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Eligibility Criteria</h2>
                            <p className="text-gray-700">{course.eligibility || 'Please contact the college for eligibility details.'}</p>
                        </section>
                    </div>

                    <aside className="space-y-6 lg:mt-0">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Program Details</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex justify-between"><strong>Fees:</strong> <span>{course.fees}</span></li>
                                <li className="flex justify-between"><strong>Duration:</strong> <span>{course.duration}</span></li>
                                <li className="flex justify-between"><strong>Opens:</strong> <span>{course.admissionOpenDate ? new Date(course.admissionOpenDate).toLocaleDateString() : 'N/A'}</span></li>
                                <li className="flex justify-between"><strong>Closes:</strong> <span>{course.admissionEndDate ? new Date(course.admissionEndDate).toLocaleDateString() : 'N/A'}</span></li>
                            </ul>
                            
                            {hasSeats && (
                                <div className="mt-5">
                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                        <span>Seat Availability</span>
                                        <span>{occupancy.toFixed(0)}% Full</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                                    </div>
                                    <p className="text-sm text-center text-gray-500 mt-2">{availableSeats} of {course.totalSeats} seats remaining</p>
                                </div>
                            )}

                            <button
                                onClick={() => navigate(`/apply/${college.id}`)}
                                disabled={occupancy >= 100}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {occupancy >= 100 ? 'Seats Full' : 'Apply Now'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FeaturedAdDetailPage;