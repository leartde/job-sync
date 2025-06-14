import api from "../../utils/api.ts";

const DeleteJob = async(employerId: string, jobId: string) => {
  const url = `employers/${employerId}/jobs/${jobId}`;
  try {
    return await api.delete(url);
  } catch (error) {
    console.error("Error deleting job:", error);
  }
}

export default DeleteJob;
