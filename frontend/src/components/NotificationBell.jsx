import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, X, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import PropTypes from "prop-types";

const NotificationBell = () => {
    const { notifications, unreadCount, markNotificationRead, markAllRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "QUIZ_GRADED":
                return "📝";
            case "ENROLLED":
                return "🎓";
            case "NEW_COURSE":
                return "📚";
            case "LESSON_COMPLETE":
                return "✅";
            case "COURSE_COMPLETE":
                return "🏆";
            default:
                return "🔔";
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-slate-700">
                            {notifications.slice(0, 10).map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition ${!notif.is_read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                                        }`}
                                    onClick={() => !notif.is_read && markNotificationRead(notif.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">
                                            {getNotificationIcon(notif.notification_type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`text-sm ${!notif.is_read ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}
                                            >
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {formatTime(notif.created_at)}
                                            </p>
                                        </div>
                                        {!notif.is_read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    {notifications.length > 10 && (
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-700 text-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Showing 10 of {notifications.length} notifications
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
