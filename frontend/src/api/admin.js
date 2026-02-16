import api from "./axios";

// NOTE: Ensure the backend has an endpoint for listing users at /admin-api/users/
export const fetchUsers = (role = "ALL") => {
    return api.get(`/admin-api/users/?role=${role}`);
};

export const toggleUserStatus = (userId) => {
    return api.patch(`/admin-api/users/${userId}/toggle-status/`);
};

export const exportAdminResults = (format) => {
    return api.get(`/admin-api/export-results/?format=${format}`, {
        responseType: "blob"
    });
};
