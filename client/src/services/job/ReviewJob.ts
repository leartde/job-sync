import api from "../../utils/api.ts";


const ReviewJob = async(employerId:string, jobId: string, status: 1 | 2) => {
  const url = `employers/${employerId}/jobs/${jobId}/reviewal?status=${status}`
  try{
    return await api.put(url);
  }
  catch (error) {
    console.error("Error reviewing job:", error);
    throw error;
  }
};

export default ReviewJob;
