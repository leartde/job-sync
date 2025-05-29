import api from "../../utils/api.ts";

const FetchEmployer = async (employerId: string | undefined) => {
    try {
        const url = `/employers/${employerId}`;
        return await api.get(url);
    } catch (e) {
        console.error("Error fetching employer: ", e);
    }
}

export default FetchEmployer;