import api from "../../utils/api.ts";

const DeleteJobSkills = async(employerId:string,jobId: string, skillId: string) => {
  const url = `/employers/${employerId}/jobs/${jobId}/skills/${skillId}`;
  try {
    const response = await api.delete(url );
    if (response.status === 200) return response;
  } catch (error) {
    console.error("Error creating job seeker skills:", error);
  }
}

export default DeleteJobSkills;
