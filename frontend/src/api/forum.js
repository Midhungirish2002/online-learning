import api from "./axios";

/**
 * Fetch comments for a course, optionally filtered by lesson.
 * @param {number} courseId
 * @param {number|null} lessonId (optional)
 */
export const fetchComments = (courseId, lessonId = null) => {
    let url = `/courses/${courseId}/comments/`;
    if (lessonId) {
        url += `?lesson_id=${lessonId}`;
    }
    return api.get(url);
};

/**
 * Post a new comment.
 * @param {number} courseId
 * @param {object} data { text, lesson (id), parent (id) }
 */
export const createComment = (courseId, data) => {
    return api.post(`/courses/${courseId}/comments/`, data);
};

/**
 * Delete a comment.
 * @param {number} commentId
 */
export const deleteComment = (commentId) => {
    return api.delete(`/comments/${commentId}/`);
};
