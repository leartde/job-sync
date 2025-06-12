import api from "../../utils/api.ts";

const DeleteJobBenefit = async(employerId:string, jobId:string, benefit:string) => {
  const url = `employers/${employerId}/jobs/${jobId}/benefits/${benefit}`;
  try{
    return await api.delete(url);
  }
  catch (error) {
    console.error("Error adding job benefit:", error);
  }
}

export default DeleteJobBenefit;
