import api from "./api";

// Get all users
export const getAllUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};