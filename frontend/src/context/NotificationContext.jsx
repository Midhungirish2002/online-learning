import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import {
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
} from "../api/notifications";
import PropTypes from "prop-types";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, tokens } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // Load initial notifications from REST API
    const loadNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const [notifRes, countRes] = await Promise.all([
                fetchNotifications(),
                fetchUnreadCount()
            ]);
            setNotifications(notifRes.data);
            setUnreadCount(countRes.data.unread_count);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        }
    }, [user]);

    // Connect to WebSocket
    const connectWebSocket = useCallback(() => {
        if (!tokens?.access || wsRef.current?.readyState === WebSocket.OPEN) return;

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//localhost:8000/ws/notifications/?token=${tokens.access}`;

        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("🔔 Notification WebSocket connected");
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "notification") {
                        const newNotif = data.notification;
                        setNotifications((prev) => [newNotif, ...prev]);
                        setUnreadCount((prev) => prev + 1);
                    }
                } catch (err) {
                    console.error("Failed to parse notification:", err);
                }
            };

            ws.onclose = (event) => {
                console.log("🔔 Notification WebSocket closed:", event.code);
                setIsConnected(false);
                wsRef.current = null;

                // Reconnect after 5 seconds if not intentional close
                if (event.code !== 1000 && tokens?.access) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, 5000);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            wsRef.current = ws;
        } catch (err) {
            console.error("Failed to create WebSocket:", err);
        }
    }, [tokens?.access]);

    // Disconnect WebSocket
    const disconnectWebSocket = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close(1000, "User logged out");
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    // Connect/disconnect based on user auth state
    useEffect(() => {
        if (user && tokens?.access) {
            loadNotifications();
            connectWebSocket();
        } else {
            disconnectWebSocket();
            setNotifications([]);
            setUnreadCount(0);
        }

        return () => {
            disconnectWebSocket();
        };
    }, [user, tokens?.access, loadNotifications, connectWebSocket, disconnectWebSocket]);

    // Mark single notification as read
    const markNotificationRead = useCallback(async (notificationId) => {
        try {
            await markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    }, []);

    // Mark all notifications as read
    const markAllRead = useCallback(async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isConnected,
                markNotificationRead,
                markAllRead,
                loadNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
