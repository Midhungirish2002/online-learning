import { useEffect, useState } from "react";
import { fetchMyCourses } from "../../api/courses";
import CourseCard from "../../components/CourseCard";

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetchMyCourses();
                setCourses(response.data);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-8 bg-white dark:bg-slate-950 flex justify-center text-slate-900 dark:text-white transition-colors duration-300">
                <div className="animate-pulse">Loading courses...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 px-8 bg-white dark:bg-slate-950 flex justify-center text-red-600 dark:text-red-400 transition-colors duration-300">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        My Learning
                    </h1>
                    {/* Placeholder for Browse Courses button */}
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-900 dark:text-white">
                        Browse More Courses
                    </button>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-800 border-dashed transition-colors duration-300">
                        <h2 className="text-xl text-slate-600 dark:text-gray-400 mb-4">
                            You are not enrolled in any courses yet.
                        </h2>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
