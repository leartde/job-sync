import api from "../../utils/api.ts";

const CreateJobSkills = async(employerId:string,jobId: string, skills: string[]) => {
  const url = `/employers/${employerId}/jobs/${jobId}/skills`;
  try {
    const response = await api.post(url,skills );
    if (response.status === 200) return response;
  } catch (error) {
    console.error("Error creating job seeker skills:", error);
  }
}

export default CreateJobSkills;

