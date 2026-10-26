import api from "./api";

export const getOverallAttendanceReport = async () => {
    const response = await api.get("/attendance/reports/overall");
    return response.data;
};

export const getStudentAttendanceReports = async () => {
    const response = await api.get("/attendance/reports/students");
    return response.data;
};

export const getSessionAttendanceSummaries = async () => {
    const response = await api.get(
        "/attendance/reports/sessions/summary"
    );
    return response.data;
};

export const getAvailableAttendanceSessions = async () => {
    const response = await api.get("/attendance/sessions/available");
    return response.data;
};

export const getMyEnrollmentRequests = async () => {
    const response = await api.get(
        "/attendance/sessions/enrollment-requests/mine"
    );
    return response.data;
};

export const requestSessionEnrollment = async (sessionId) => {
    const response = await api.post(
        `/attendance/sessions/${sessionId}/enrollment-requests`
    );
    return response.data;
};

export const getPendingEnrollmentRequests = async () => {
    const response = await api.get(
        "/attendance/sessions/enrollment-requests"
    );
    return response.data;
};

export const approveEnrollmentRequest = async (enrollmentId) => {
    const response = await api.post(
        `/attendance/sessions/enrollment-requests/${enrollmentId}/approve`
    );
    return response.data;
};

export const rejectEnrollmentRequest = async (enrollmentId) => {
    const response = await api.post(
        `/attendance/sessions/enrollment-requests/${enrollmentId}/reject`
    );
    return response.data;
};
export const createAttendanceSession = async (title, courseId) => {
    const response = await api.post("/attendance/sessions", {
        title,
        courseId: courseId ? Number(courseId) : null
    });

    return response.data;
};