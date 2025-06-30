import api from "../../utils/api";
import { LogUser } from "../../types/authentication/LogUser.ts";

export const Authorize = async ({ email, password, isPersistent }: LogUser) => {
    const url = `/authentication/login?isPersistent=${isPersistent}`;

    try {
        return await api.post(url, { email, password });
    } catch (error) {
        console.error("Error logging in:", error);
        throw new Error("Authorize failed");
    }
};

