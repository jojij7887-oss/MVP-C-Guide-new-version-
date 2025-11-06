import React from 'react';
import { Link } from 'react-router-dom';
import { User, College, Course } from '../types';

interface FavoritesPageProps {
  user: User;
  colleges: College[];
}

const CollegeCard: React.FC<{ college: College }> = ({ college }) => (
  <Link to={`/college/${college.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img className="h-48 w-full object-cover" src={college.photoUrl} alt={college.name} />
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{college.location}</p>
      <p className="mt-4 text-gray-700">{college.shortDescription}</p>
    </div>
  </Link>
);

interface FavoriteCourse extends Course {
    collegeName: string;
    collegeId: string;
}

const CourseCard: React.FC<{ course: FavoriteCourse }> = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-indigo-700">{course.name}</h3>
        <Link to={`/college/${course.collegeId}`} className="text-sm text-gray-500 mt-1 hover:underline">{course.collegeName}</Link>
        <p className="mt-4 text-gray-700">{course.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
            <span>Duration: {course.duration}</span>
            <span>|</span>
            <span>Fees: {course.fees}</span>
        </div>
    </div>
);

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user, colleges }) => {
  const favoriteColleges = colleges.filter(college => user.favoriteCollegeIds.includes(college.id));

  const favoriteCourses: FavoriteCourse[] = [];
  user.favoriteCourseIds.forEach(courseId => {
      for (const college of colleges) {
          const course = college.courses.find(c => c.id === courseId);
          if (course) {
              favoriteCourses.push({ ...course, collegeId: college.id, collegeName: college.name });
              break;
          }
      }
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mt-2 text-lg text-gray-600">Your saved colleges and courses for quick access.</p>
      </div>

      <section>
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">Favorite Colleges</h2>
          {favoriteColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteColleges.map(college => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-500">You haven't saved any colleges yet.</p>
              <p className="text-gray-400 mt-2">Click the star icon on a college's profile to add it to your favorites.</p>
              <Link to="/search" className="mt-6 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                Start Searching
              </Link>
            </div>
          )}
      </section>

      <section>
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">Favorite Courses</h2>
          {favoriteCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-500">You haven't saved any courses yet.</p>
              <p className="text-gray-400 mt-2">Click the star icon next to a course to add it here.</p>
            </div>
          )}
      </section>
    </div>
  );
};

export default FavoritesPage;