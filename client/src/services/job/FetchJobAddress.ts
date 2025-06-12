import api from "../../utils/api.ts";

const FetchJobAddress = async(employerId: string, jobId: string) => {
  const url = `/employers/${employerId}/jobs/${jobId}/address`;
  try {
    return await api.get(url);
  } catch (error) {
    console.error("Error fetching the job address:", error);
  }
}

export default FetchJobAddress;
