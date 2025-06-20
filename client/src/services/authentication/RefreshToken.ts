import axios from "axios";

const RefreshToken = async (isPersistent: boolean) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
const url = `${baseURL}/authentication/refresh?rememberMe=${isPersistent}`;
    try {
        const response = await axios.post(url, {}, {
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error("Invalid response status");
        }

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        return { newAccessToken, newRefreshToken };
    } catch (error) {
        console.error("Refresh failed:", error);
        throw error;
    }
};

export default RefreshToken;
