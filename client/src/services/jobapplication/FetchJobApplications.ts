import api from "../../utils/api.ts";

const FetchJobApplications = async (employerId:string, jobId: string,) => {
  const url = `/employers/${employerId}/jobs/${jobId}/applications`;
  try {
   return await api.get(url);

  } catch (error) {
    console.error("Error fetching job applications:", error);
  }

}

export default FetchJobApplications;
