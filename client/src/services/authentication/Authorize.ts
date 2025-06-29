import api from "../../utils/api";
import { LogUser } from "../../types/authentication/LogUser.ts";

export const Authorize = async ({ email, password, isPersistent }: LogUser) => {
    const url = `/authentication/login?isPersistent=${isPersistent}`;

    try {
        const response = await api.post(url, { email, password });

        console.log("RESPONSE: ", response);
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw new Error("Authorize failed");
    }
};

