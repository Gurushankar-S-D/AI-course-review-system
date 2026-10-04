import api from "./api";


// =========================
// LOGIN
// =========================

export const login = async (username, password) => {

    const response = await api.post("/auth/login", {
        username,
        password,
    });

    return response.data;
};


// =========================
// REGISTER
// =========================

export const register = async (username, email, password) => {
    const response = await api.post("/users/register", {
        username,
        email,
        password,
    });

    return response.data;
};


// =========================
// LOGOUT
// =========================

export const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


// =========================
// GET TOKEN
// =========================

export const getToken = () => {

    return localStorage.getItem("token");
};