import api from "./axios";

export const fetchLessons = (courseId) => {
    return api.get(`/courses/${courseId}/lessons/`);
};

export const fetchLessonById = (lessonId) => {
    return api.get(`/lessons/${lessonId}/`);
};

export const createLesson = (courseId, lessonData) => {
    return api.post(`/courses/${courseId}/lessons/`, lessonData);
};

export const completeLesson = (lessonId) => {
    return api.post(`/lessons/${lessonId}/complete/`);
};

// Lecture Notes APIs
export const fetchNotes = (lessonId) => {
    return api.get("/notes/", { params: { lesson_id: lessonId } });
};

export const createNote = (lessonId, content) => {
    return api.post("/notes/", { lesson_id: lessonId, content });
};

export const updateNote = (noteId, content) => {
    return api.patch(`/notes/${noteId}/`, { content });
};

export const deleteNote = (noteId) => {
    return api.delete(`/notes/${noteId}/`);
};
