import axios from "axios";

const api = axios.create({
    baseURL: "https://fullstackgenai-production.up.railway.app",
    withCredentials: true
});

// Helper function to standardize errors
const handleApiError = (err, defaultMessage) => {
    const customError = {
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message || defaultMessage,
    };
    // THROW the error so the Hooks layer can catch it!
    throw customError; 
};


export const register = async ({ firstname, lastname, email, password }) => {
    try {
        const response = await api.post("/api/auth/register", {
            firstname,
            lastname,
            email,
            password
        });

        return response.data;
    } catch (err) {
        handleApiError(err,"Failed to Register User");
    }
};
export const login = async ({ email, password }) => {
    try {
        const response = await api.post("/api/auth/login", {
            email,
            password
        });
        return response.data;
    } catch (err) {
        handleApiError(err,"Failed to login");
    }
};
export const getMe = async () => {
    try {
        const response = await api.get("/api/auth/getMe");

        return response.data;
    } catch (err) {
        handleApiError(err,"Failed to fetched User");
    }
};
export const logout = async () => {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        handleApiError(err,"Failed to logout");
    }
};
