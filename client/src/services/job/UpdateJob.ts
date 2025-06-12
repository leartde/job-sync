import { AddJob } from "../../types/job/AddJob.ts";
import api from "../../utils/api.ts";

const UpdateJob = async (employerId: string, jobId: string, job: AddJob) => {
  const url = `employers/${employerId}/jobs/${jobId}`;
  const form = new FormData();
  form.append("Title", job.title || "");
  form.append("Description", job.description || "");
  form.append("Type", job.type || "");
  form.append("HourlyPay", job.hourlyPay?.toString() || "");
  form.append("HasMultipleSpots", job.hasMultipleSpots?.valueOf().toString() || "false");
  form.append("IsTakingApplications", job.isTakingApplications?.valueOf().toString() || "true");
  if (job.image && job.image instanceof File) {
    form.append("Image", job.image);
  }
   try {
     return await api.put(url, form);
   }
  catch (error) {
    console.error("Error updating the job:", job, error);
  }
}

export default UpdateJob;
