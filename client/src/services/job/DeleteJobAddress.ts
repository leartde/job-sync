import api from "../../utils/api.ts";

const DeleteJobAddress = async(employerId: string, jobId: string) => {
  const url = `/employers/${employerId}/jobs/${jobId}/address`;
  try {
    return await api.delete(url);
  } catch (error) {
    console.error("Error deleting the job address:", error);
    return null;
  }
}

export default DeleteJobAddress;
