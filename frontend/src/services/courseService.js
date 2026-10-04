import api from "./api";

// Get all courses
export const getAllCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
};

// Get course summary
export const getCourseSummary = async () => {
    const response = await api.get("/courses/summary");
    return response.data;
};

// Add course
export const addCourse = async (courseName, description) => {
    const response = await api.post("/courses", {
        courseName: courseName.trim(),
        description: description.trim()
    });

    return response.data;
};

// Update course
export const updateCourse = async (
    courseId,
    courseName,
    description
) => {
    const response = await api.put(`/courses/${courseId}`, {
        courseName: courseName.trim(),
        description: description.trim()
    });

    return response.data;
};

// Delete course
export const deleteCourse = async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
};