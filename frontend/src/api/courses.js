import api from "./axios";

export const fetchCourses = (params = {}) => {
    // params: { mine: true } for instructor dashboard
    return api.get("/courses/", { params });
};

export const fetchCourseById = (courseId) => {
    return api.get(`/courses/${courseId}/`);
};

export const createCourse = (courseData) => {
    return api.post("/courses/", courseData);
};

export const toggleCourseStatus = (courseId) => {
    return api.patch(`/courses/${courseId}/toggle-status/`);
};

export const publishCourse = (courseId, isPublished) => {
    return api.patch(`/courses/${courseId}/publish/`, { is_published: isPublished });
};

export const enrollCourse = (courseId) => {
    return api.post(`/courses/${courseId}/enroll/`);
};

export const fetchMyCourses = () => {
    return api.get("/my-courses/");
};

export const rateCourse = (courseId, ratingData) => {
    return api.post(`/courses/${courseId}/rate/`, ratingData);
};

export const deleteCourse = (courseId) => {
    return api.delete(`/courses/${courseId}/delete/`);
};

// Wishlist APIs
export const fetchWishlist = () => {
    return api.get("/wishlist/");
};

export const addToWishlist = (courseId) => {
    return api.post("/wishlist/", { course_id: courseId });
};

export const removeFromWishlist = (wishlistId) => {
    return api.delete(`/wishlist/${wishlistId}/`);
};
