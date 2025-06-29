import axios from "axios";
import RefreshToken from "../services/authentication/RefreshToken.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const refreshAuthToken = async () => {
  try {
    const isPersistent = localStorage.getItem("isPersistent") === "true";
    const response = await RefreshToken(isPersistent);
    accessToken = response.data.accessToken || null;
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    accessToken = null;
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
