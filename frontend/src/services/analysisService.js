import api from "./api";

// Get AI analysis for a specific review
export const getReviewAnalysis = async (reviewId) => {
    const response = await api.get(`/reviews/${reviewId}/analysis`);
    return response.data;
};

// Get AI analyses for multiple reviews
export const getAnalysesForReviews = async (reviews) => {
    const results = await Promise.allSettled(
        reviews.map((review) => getReviewAnalysis(review.reviewId))
    );

    return results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
};