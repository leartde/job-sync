import api from "../../utils/api.ts";

const FetchJobSkills = async (employerId: string, jobId: string) => {
    const url = `/employers/${employerId}/jobs/${jobId}/skills`;
    try {
        const response = await api.get(url);
        if (response.status === 200) return response.data;
    } catch (error) {
        console.error("Error fetching job skills:", error);
    }
}

export default FetchJobSkills;
