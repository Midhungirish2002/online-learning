import api from "./axios";

export const fetchQuizzes = (courseId) => {
    return api.get(`/courses/${courseId}/quizzes/`);
};

export const createQuiz = (courseId, quizData) => {
    return api.post(`/courses/${courseId}/quizzes/`, quizData);
};

export const fetchQuestions = (quizId) => {
    return api.get(`/quizzes/${quizId}/questions/`);
};

export const createQuestion = (quizId, questionData) => {
    return api.post(`/quizzes/${quizId}/questions/`, questionData);
};

export const submitQuizAttempt = (quizId, answers) => {
    return api.post(`/quizzes/${quizId}/attempt/`, { answers });
};

export const fetchQuizResults = (quizId) => {
    return api.get(`/quizzes/${quizId}/results/`);
};
