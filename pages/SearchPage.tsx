import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { College, Course } from '../types';
import { BuildingOfficeIcon, BookOpenIcon, SearchIcon, SparklesIcon } from '../components/icons';
import { GoogleGenAI } from '@google/genai';


// A new type to hold course data along with its parent college's info.
interface CourseWithCollege extends Course {
  collegeName: string;
  collegeId: string;
}

const CleanCourseCard: React.FC<{ course: CourseWithCollege }> = ({ course }) => {
    const availableSeats = (course.totalSeats || 0) - (course.enrollmentCount || 0);
    const hasSeatsData = course.totalSeats !== undefined;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transition-shadow hover:shadow-xl h-full border border-gray-200">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-indigo-700">{course.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Offered by <Link to={`/college/${course.collegeId}`} className="font-medium text-gray-700 hover:underline">{course.collegeName}</Link>
                </p>
                
                <div className="mt-4 space-y-2 text-sm">
                    <p className="text-gray-800"><strong className="font-medium text-gray-600">Fees:</strong> {course.fees}</p>
                    {hasSeatsData && (
                        <p className="text-gray-800">
                            <strong className="font-medium text-gray-600">Seat Availability:</strong>
                            <span className={`font-bold ml-2 ${availableSeats > 20 ? 'text-green-600' : availableSeats > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                                {availableSeats > 0 ? `${availableSeats} seats left` : 'Seats Full'}
                            </span>
                        </p>
                    )}
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
                <Link to={`/college/${course.collegeId}/course/${course.id}`} className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    View Details
                </Link>
            </div>
        </div>
    );
};

interface SearchPageProps {
  colleges: College[];
}

const SearchPage: React.FC<SearchPageProps> = ({ colleges }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');


  // Memoize all courses for performance
  const allCourses: CourseWithCollege[] = useMemo(() => colleges.flatMap(college =>
    college.courses.map(course => ({
      ...course,
      collegeName: college.name,
      collegeId: college.id,
    }))
  ), [colleges]);

  // Memoize filtered results based on search query
  const filteredColleges = useMemo(() => {
    if (!searchQuery) return []; // Don't compute if no query
    const lowercasedQuery = searchQuery.toLowerCase();
    return colleges.filter(college =>
      college.name.toLowerCase().includes(lowercasedQuery) ||
      college.location.toLowerCase().includes(lowercasedQuery)
    );
  }, [colleges, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return []; // Don't compute if no query
    const lowercasedQuery = searchQuery.toLowerCase();
    return allCourses.filter(course =>
      course.name.toLowerCase().includes(lowercasedQuery) ||
      course.collegeName.toLowerCase().includes(lowercasedQuery)
    );
  }, [allCourses, searchQuery]);

  const popularColleges = useMemo(() => colleges.filter(c => c.isFeatured), [colleges]);
  
    const handleAiSearch = async () => {
        setIsAiLoading(true);
        setAiError('');
        setAiResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const collegeDataString = JSON.stringify(colleges.map(c => ({
                id: c.id,
                name: c.name,
                location: c.location,
                courses: c.courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    fees: course.fees,
                    duration: course.duration,
                    eligibility: course.eligibility
                }))
            })));

            const prompt = `You are a helpful college search assistant for an app called C-Guide. Based ONLY on the following college data, answer the user's query. Provide a concise, friendly, and conversational summary. Suggest specific colleges or courses that match the query, explaining why they are a good fit. Do not list all the data; instead, provide a helpful recommendation. If no colleges match, say so politely. Here is the available college data in JSON format: ${collegeDataString}. Now, please answer this user's query: "${aiQuery}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiResponse(response.text);

        } catch (e) {
            console.error(e);
            setAiError('Sorry, something went wrong while searching with AI. Please check your connection or API key and try again.');
        } finally {
            setIsAiLoading(false);
        }
    };


  return (
    <div className="space-y-12">
      {/* Search Bar Section */}
      <section>
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2">Find Your Perfect Fit</h1>
        <p className="text-lg text-gray-600 text-center mb-6">Discover colleges and courses tailored to your ambitions.</p>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for colleges, courses, or locations..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Search colleges and courses"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </section>

       {/* AI Search Section */}
        <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-indigo-600" />
                AI-Powered Search
            </h2>
            <p className="text-gray-600 mb-4">
                Ask a question in natural language, like "Find computer science courses with low fees" or "best arts colleges in Greenwood City".
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g., recommend business schools..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    rows={2}
                />
                <button
                    onClick={handleAiSearch}
                    disabled={isAiLoading || !aiQuery}
                    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                >
                    {isAiLoading ? 'Thinking...' : 'Search with AI'}
                </button>
            </div>

            {/* AI Response Area */}
            {isAiLoading && <p className="mt-4 text-center text-gray-600 animate-pulse">AI is thinking...</p>}
            {aiError && <p className="mt-4 text-center text-red-600">{aiError}</p>}
            {aiResponse && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">AI Response:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                </div>
            )}
        </section>

      {searchQuery ? (
        <>
          {/* Search Results Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges ({filteredColleges.length})</h2>
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredColleges.map(college => (
                  <div key={college.id} className="group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                      <img className="h-40 w-full object-cover" src={college.photoUrl} alt={college.name} />
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{college.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{college.location}</p>
                        <Link to={`/college/${college.id}`} className="inline-block mt-auto pt-4 text-indigo-600 font-semibold text-sm hover:underline">
                          View College & Courses &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-lg text-gray-600">No colleges found for "{searchQuery}".</p>
                <p className="text-sm text-gray-500">Try a different search term.</p>
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Courses ({filteredCourses.length})</h2>
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredCourses.map(course => <CleanCourseCard key={course.id} course={course} />)}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-lg text-gray-600">No courses found for "{searchQuery}".</p>
                    <p className="text-sm text-gray-500">Please try a different search term.</p>
                </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Default view when no search query */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Most Popular Colleges</h2>
            {popularColleges.length > 0 ? (
              <div className="flex overflow-x-auto space-x-8 pb-4 -mx-4 px-4">
                {popularColleges.map(college => (
                  <div key={college.id} className="flex-shrink-0 w-80 group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                      <img className="h-40 w-full object-cover" src={college.photoUrl} alt={college.name} />
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{college.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{college.location}</p>
                        <Link to={`/college/${college.id}`} className="inline-block mt-auto pt-4 text-indigo-600 font-semibold text-sm hover:underline">
                          View College & Courses &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-lg text-gray-600">No popular colleges to show right now.</p>
                    <p className="text-sm text-gray-500">Check back later for featured institutions.</p>
                </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore All Courses</h2>
            {allCourses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allCourses.map(course => <CleanCourseCard key={course.id} course={course} />)}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-lg text-gray-600">No courses available.</p>
                    <p className="text-sm text-gray-500">Please check back later.</p>
                </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default SearchPage;