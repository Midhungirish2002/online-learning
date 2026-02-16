import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyCourses } from "../../api/courses";
import CourseCard from "../../components/CourseCard";

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetchMyCourses();
                // Handle both direct array and paginated response { results: [] }
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Pagination Logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

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
                    <Link
                        to="/student/courses"
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-900 dark:text-white"
                    >
                        Browse More Courses
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-800 border-dashed transition-colors duration-300">
                        <h2 className="text-xl text-slate-600 dark:text-gray-400 mb-4">
                            You are not enrolled in any courses yet.
                        </h2>
                        <Link
                            to="/student/courses"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center text-slate-600 dark:text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;
