import axios from "axios";

const RefreshToken = async (isPersistent: boolean) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
const url = `${baseURL}/authentication/refresh?rememberMe=${isPersistent}`;
    try {
       return await axios.post(url, {}, {
            withCredentials: true
        });

    } catch (error) {
        console.error("Refresh failed:", error);
    }
};

export default RefreshToken;
