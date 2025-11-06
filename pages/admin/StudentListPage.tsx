import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Application, User } from '../../types';
import { SearchIcon, UserGroupIcon } from '../../components/icons';

interface StudentListPageProps {
    applications: Application[];
    usersData: Record<string, User>;
}

interface StudentInfo {
    id: string;
    name: string;
    email: string;
    courses: string[];
    lastActive: string;
    latestApplicationId: string;
}

const StudentListPage: React.FC<StudentListPageProps> = ({ applications, usersData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const students = useMemo(() => {
        const studentMap = new Map<string, StudentInfo>();

        applications.forEach(app => {
            const studentId = app.userId;
            const existingStudent = studentMap.get(studentId);

            if (existingStudent) {
                existingStudent.courses.push(app.course);
                if (new Date(app.submittedDate) > new Date(existingStudent.lastActive)) {
                    existingStudent.lastActive = app.submittedDate;
                    existingStudent.latestApplicationId = app.id;
                }
            } else {
                studentMap.set(studentId, {
                    id: studentId,
                    name: app.applicantName,
                    email: app.applicantEmail,
                    courses: [app.course],
                    lastActive: app.submittedDate,
                    latestApplicationId: app.id,
                });
            }
        });

        return Array.from(studentMap.values()).sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
    }, [applications]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        return students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const handleStudentClick = (student: StudentInfo) => {
        // Navigate to the details page of the student's most recent application
        navigate(`/admin/admissions/${student.latestApplicationId}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <UserGroupIcon className="h-8 w-8 text-gray-500" />
                        Student Directory
                    </h1>
                    <p className="mt-1 text-gray-600">A list of all students who have applied to your college.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses Applied</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map(student => (
                            <tr key={student.id} onClick={() => handleStudentClick(student)} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.courses.join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(student.lastActive).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentListPage;