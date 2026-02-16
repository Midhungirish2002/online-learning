import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Menu, X, Home, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";
import PropTypes from "prop-types";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLink = (path) =>
        `text-sm transition ${location.pathname === path
            ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400 border-b-2 pb-1"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        }`;

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* LEFT — BRAND */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <Home size={18} className="text-blue-600 dark:text-blue-400" />
                        <div className="leading-tight">
                            <span className="block text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                                Ocean School
                            </span>
                            <span className="block text-[10px] text-gray-500 dark:text-gray-400">
                                {!user && "Online Learning Platform"}
                                {user?.role === "STUDENT" && "Student Portal"}
                                {user?.role === "INSTRUCTOR" && "Instructor Portal"}
                                {user?.role === "ADMIN" && "Admin Portal"}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* CENTER — ROLE NAV */}
                <div className="hidden md:flex items-center gap-8">
                    {user?.role === "INSTRUCTOR" && (
                        <>
                            <Link
                                to="/instructor/courses"
                                className={navLink("/instructor/courses")}
                            >
                                My Courses
                            </Link>
                            <Link
                                to="/instructor/students"
                                className={navLink("/instructor/students")}
                            >
                                My Students
                            </Link>
                            <Link
                                to="/instructor/dashboard"
                                className={navLink("/instructor/dashboard")}
                            >
                                Analytics
                            </Link>
                        </>
                    )}

                    {user?.role === "STUDENT" && (
                        <>
                            <Link to="/student/courses" className={navLink("/student/courses")}>
                                Browse Courses
                            </Link>
                            <Link to="/student/wishlist" className={navLink("/student/wishlist")}>
                                Wishlist
                            </Link>
                            <Link
                                to="/student/my-learning"
                                className={navLink("/student/my-learning")}
                            >
                                My Learning
                            </Link>
                        </>
                    )}

                    {user?.role === "ADMIN" && (
                        <Link to="/admin/dashboard" className={navLink("/admin/dashboard")}>
                            Admin Dashboard
                        </Link>
                    )}
                </div>

                {/* RIGHT — CONTROLS */}
                <div className="flex items-center gap-4">
                    {/* NOTIFICATION BELL (only for logged-in users) */}
                    {user && <NotificationBell />}

                    {/* THEME TOGGLE */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* PROFILE */}
                    {user && (
                        <Link to="/profile" className="flex items-center gap-2">
                            {user.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-gray-600"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User size={14} />
                                </div>
                            )}
                            <span className="hidden lg:block text-sm text-gray-700 dark:text-gray-300">
                                {user.username}
                            </span>
                        </Link>
                    )}

                    {/* LOGOUT */}
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg px-4 py-2 text-sm font-medium"
                        >
                            Logout
                        </button>
                    )}

                    {/* MOBILE MENU */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
