import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses as getCourses } from "../../api/courses";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const res = await getCourses({ mine: true });
            // Robust check for pagination object vs array
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setCourses(data);
        } catch (err) {
            console.error("Failed to fetch instructor courses", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter((course) => {
        if (filterStatus === "ALL") return true;
        if (filterStatus === "PUBLISHED") return course.is_published;
        if (filterStatus === "DRAFT") return !course.is_published;
        return true;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    if (loading) {
        return <div className="pt-24 text-center text-gray-400">Loading your courses...</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-6 bg-slate-950 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold"
                    >
                        My Courses
                    </motion.h1>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>

                {filteredCourses.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400"
                    >
                        {courses.length === 0
                            ? "You haven’t created any courses yet."
                            : "No courses match the selected filter."}
                    </motion.p>
                ) : (
                    <div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none text-slate-900 dark:text-white relative overflow-hidden"
                                >
                                    <div
                                        className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                                            course.is_published
                                                ? "bg-green-500 text-white"
                                                : "bg-yellow-500 text-black"
                                        }`}
                                    >
                                        {course.is_published ? "Published" : "Draft"}
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2 pr-8">
                                        {course.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(`/instructor/course/${course.id}/manage`)
                                        }
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                        <Eye size={18} />
                                        Manage Course
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 pb-8">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center text-gray-400">
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

export default InstructorCourses;
