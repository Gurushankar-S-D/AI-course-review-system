import api from "./api";

export const submitReview = async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
};