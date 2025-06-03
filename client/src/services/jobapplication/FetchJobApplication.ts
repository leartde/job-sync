import api from "../../utils/api.ts";

const FetchJobApplication = async (jobId : string, jobSeekerId: string) => {
    const url = `/jobapplications/${jobId}/${jobSeekerId}`;
    try {
        return await api.get(url);

    } catch (error) {
        console.error("Error fetching job application:", error);
    }
}

export default FetchJobApplication;
