import api from "./axios";

/**
 * Fetch all notifications for the authenticated user.
 */
export const fetchNotifications = () => {
    return api.get("/notifications/");
};

/**
 * Get the count of unread notifications.
 */
export const fetchUnreadCount = () => {
    return api.get("/notifications/unread-count/");
};

/**
 * Mark a specific notification as read.
 */
export const markAsRead = (notificationId) => {
    return api.patch(`/notifications/${notificationId}/read/`);
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = () => {
    return api.post("/notifications/mark-all-read/");
};

/**
 * Clear all notifications.
 */
export const clearNotifications = () => {
    return api.delete("/notifications/clear/");
};
