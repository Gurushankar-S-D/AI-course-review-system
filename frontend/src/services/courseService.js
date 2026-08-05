import api from "./api";

export const getAllCourses = async () => {
    const response = await api.get("/courses", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};