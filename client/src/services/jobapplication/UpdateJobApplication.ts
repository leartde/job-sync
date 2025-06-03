import api from "../../utils/api.ts";

const UpdateJobApplication = async (employerId: string,jobId: string, jobSeekerId:string,status:number | undefined) => {
  const url = `/employers/${employerId}/jobs/${jobId}/applications/${jobSeekerId}`;
  const statusPayload = {
    status: status
  };
  try{
    return await api.put(url,statusPayload);
  }
  catch (error){
    console.error("Error updating job application:", error);
  }
}

export default UpdateJobApplication;
