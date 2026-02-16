import { useEffect, useState } from "react";
import {
    fetchCourses as getCourses,
    fetchMyCourses as getMyCourses,
    enrollCourse
} from "../../api/courses";
import { useNavigate } from "react-router-dom";
import { Search, Loader, BookOpen, Clock, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../../api/courses";

const BrowseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [wishlist, setWishlist] = useState(new Map()); // Map courseId to wishlistId
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchMyCourses();
        fetchWishlistData();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            // Handle potential pagination or array
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setCourses(data);
        } catch (err) {
            console.error("Failed to load courses", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch enrolled courses (SRS-compliant)
    const fetchMyCourses = async () => {
        try {
            const res = await getMyCourses();
            // API returns array of course objects with {id, title, description, ...}
            const ids = new Set(res.data.map((course) => course.id));
            setEnrolledIds(ids);
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    const fetchWishlistData = async () => {
        try {
            const res = await fetchWishlist();
            const wishlistMap = new Map();
            res.data.forEach(item => {
                wishlistMap.set(item.course, item.id);
            });
            setWishlist(wishlistMap);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const toggleWishlist = async (courseId) => {
        try {
            if (wishlist.has(courseId)) {
                // Remove from wishlist
                await removeFromWishlist(wishlist.get(courseId));
                setWishlist(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(courseId);
                    return newMap;
                });
            } else {
                // Add to wishlist
                const res = await addToWishlist(courseId);
                setWishlist(prev => new Map(prev).set(courseId, res.data.id));
            }
        } catch (err) {
            console.error("Wishlist action failed", err);
            alert("Failed to update wishlist");
        }
    };

    const handleEnroll = async (courseId) => {
        if (enrolledIds.has(courseId) || enrollingId === courseId) return;

        try {
            setEnrollingId(courseId);
            await enrollCourse(courseId);

            setEnrolledIds((prev) => new Set(prev).add(courseId));
            navigate(`/student/course/${courseId}`);
        } catch (err) {
            if (err.response?.status === 400) {
                // Already enrolled (EC-01)
                navigate(`/student/course/${courseId}`);
            } else {
                alert("Failed to enroll in course.");
            }
        } finally {
            setEnrollingId(null);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
                <Loader className="animate-spin text-blue-600 dark:text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-24 px-4 md:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Explore Courses
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Discover new skills and expand your horizons.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="relative w-full md:w-96"
                    >
                        <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                        />
                    </motion.div>
                </div>

                {/* Course Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    <AnimatePresence mode="popLayout">
                        {currentCourses.map((course) => {
                            const isEnrolled = enrolledIds.has(course.id);

                            return (
                                <motion.div
                                    key={course.id}
                                    variants={item}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    layout
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col transition-colors duration-300 relative"
                                >
                                    {/* Wishlist Heart Icon */}
                                    <button
                                        onClick={() => toggleWishlist(course.id)}
                                        className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition z-10"
                                        aria-label={wishlist.has(course.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart
                                            size={20}
                                            className={wishlist.has(course.id) ? "fill-red-500 text-red-500" : "text-slate-400"}
                                        />
                                    </button>

                                    <h3 className="text-xl font-bold mb-2 pr-8">{course.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-gray-500 mb-6">
                                        <User size={14} />
                                        <span>{course.instructor_name || "Instructor"}</span>
                                        <Clock size={14} />
                                        <span>Self-paced</span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isEnrolled}
                                        onClick={() => handleEnroll(course.id)}
                                        className={`w-full py-3 rounded-xl font-bold transition
                      ${isEnrolled
                                                ? "bg-green-100 dark:bg-green-600 text-green-700 dark:text-white cursor-not-allowed"
                                                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                                            }`}
                                    >
                                        {isEnrolled ? "Enrolled" : "Enroll Now"}
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {filteredCourses.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center gap-4 mb-8">
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
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {filteredCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 text-gray-500"
                    >
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No courses found.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default BrowseCourses;
