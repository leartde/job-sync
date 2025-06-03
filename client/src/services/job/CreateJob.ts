import { AddJob } from "../../types/job/AddJob.ts";
import api from "../../utils/api.ts";

const CreateJob = async (employerId: string, job:AddJob)=>{
  const url = `employers/${employerId}/jobs`;
  const formData = new FormData();
  formData.append("Title", job.title || "");
  formData.append("Description", job.description || "");
  formData.append("Type", job.type || "");
  formData.append("HourlyPay", job.hourlyPay?.toString() || "");
  formData.append("HasMultipleSpots", job.hasMultipleSpots?.valueOf().toString() || "false");
  formData.append("IsTakingApplications","true");
  if (job.image && job.image instanceof File) {
    formData.append("Image", job.image);
  }
  const skills = Array.isArray(job.skills) ? job.skills : [];

  skills.forEach(skill => {
    formData.append('Skills', skill);
  });

  const benefits = Array.isArray(job.benefits) ? job.benefits : [];

  benefits.forEach(benefit => {
    formData.append('Benefits', benefit);
  });

  if( job.address) {
    formData.append("Address.ZipCode", job.address.zipCode?.toString() || "0");
    formData.append("Address.Country", job.address.country || "");
    formData.append("Address.State", job.address.state || "");
    formData.append("Address.City", job.address.city || "");
    formData.append("Address.Street", job.address.street || "");
  }
  try{
     return await api.post(url, formData);
  }
  catch {
    console.error("Error creating the job:", job);}
}

export default CreateJob;
