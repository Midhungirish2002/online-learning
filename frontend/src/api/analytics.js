import api from "./axios";

export const fetchInstructorAnalytics = () => {
    return api.get("/instructor/analytics/");
};

export const fetchInstructorStudents = () => {
    return api.get("/instructor/students/");
};

export const fetchAdminDashboard = () => {
    return api.get("/admin-api/dashboard/");
};

export const fetchAdminAnalytics = () => {
    return api.get("/admin-api/analytics/");
};
