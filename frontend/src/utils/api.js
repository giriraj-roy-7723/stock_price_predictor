import axios from "axios";

// Main API for authentication, user data, profiles, etc.
const api = axios.create({
  baseURL: "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important for refresh token cookie
});



// Add auth token to main API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for main API
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/auth/refresh");

        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry original request
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error); // forward the error to the caller
  },
);

export default api;
