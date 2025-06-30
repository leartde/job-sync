import api from "../../utils/api";
import { Job } from "../../types/job/Job.ts";

const FetchJob = async (employerId,jobId) => {
    const url = `/employers/${employerId}/jobs/${jobId}`;
    try{
        const response = await api.get(url);
        if (response.status === 200){
            const job: Job = response.data;
            return job;
        }
        else{
            console.error("Error fetching the job " + response.statusText);
        }
    }
    catch (error){
        console.error("Error fetching job: ", error);
    }

}

export default FetchJob;
