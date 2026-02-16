import api from "./axios";

/**
 * Download certificate for a completed course
 * @param {number} courseId - ID of the completed course
 * @returns {Promise} - Blob response containing the PDF
 */
export const downloadCertificate = (courseId) => {
    return api.get(`/certificates/${courseId}/`, {
        responseType: "blob"
    });
};
