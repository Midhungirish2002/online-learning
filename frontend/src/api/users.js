import api from "./axios";

export const fetchProfile = (userId = null) => {
    const params = userId ? { user_id: userId } : {};
    return api.get("/profile/", { params });
};

export const updateProfile = (formData) => {
    return api.patch("/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Admin functions
export const fetchUsers = (role = "ALL") => {
    return api.get(`/admin-api/users/?role=${role}`);
};

export const toggleUserStatus = (userId) => {
    return api.patch(`/admin-api/users/${userId}/toggle-status/`);
};
