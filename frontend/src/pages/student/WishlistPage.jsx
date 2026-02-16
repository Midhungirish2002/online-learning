import { useEffect, useState } from "react";
import { fetchWishlist, removeFromWishlist } from "../../api/courses";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const res = await fetchWishlist();
            setWishlist(res.data);
        } catch (err) {
            console.error("Failed to load wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (wishlistId) => {
        try {
            await removeFromWishlist(wishlistId);
            setWishlist(prev => prev.filter(item => item.id !== wishlistId));
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
            alert("Failed to remove from wishlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Heart className="fill-red-500 text-red-500" size={36} />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Courses you want to explore later
                    </p>
                </motion.div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        <Heart size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Your wishlist is empty</p>
                        <p className="text-sm mt-2">Browse courses and click the heart icon to add them here</p>
                        <button
                            onClick={() => navigate("/student/courses")}
                            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{item.course_title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {item.course_description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="ml-4 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition text-red-500"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <BookOpen size={14} />
                                    <span>by {item.instructor_name}</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/student/courses`)}
                                    className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-lg font-medium transition"
                                >
                                    View Course
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
