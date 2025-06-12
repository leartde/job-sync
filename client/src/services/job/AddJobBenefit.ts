import api from "../../utils/api.ts";

const AddJobBenefit = async(employerId:string, jobId:string, benefit:string) => {
   const url = `employers/${employerId}/jobs/${jobId}/benefits`;
   try{
     return await api.post(url, [benefit]);
   }
   catch (error) {
     console.error("Error adding job benefit:", error);
   }
}

export default AddJobBenefit;
