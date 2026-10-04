import api from "./api";

// Submit review
export const submitReview = async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
};

// Get reviews by course
export const getReviewsByCourse = async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
};

// Get all reviews
export const getAllReviews = async () => {
    const response = await api.get("/reviews");
    return response.data;
};

// Delete review
export const deleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
};