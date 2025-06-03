import api from "../../utils/api.ts";
import { JobApplicationParameters } from "../../types/jobapplication/JobApplicationParameters.ts";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { JobApplication } from "../../types/jobapplication/JobApplication.ts";
import { JobApplicationResponse } from "../../types/jobapplication/JobApplicationResponse.ts";


const FetchJobApplications = async (employerId:string, jobId:string, parameters: JobApplicationParameters) => {
  let url = `/employers/${employerId}/jobs/${jobId}/applications?`;
  if (parameters?.HasResume) {
    url += `?HasResume=${parameters.HasResume}`;
  }
  if (parameters?.SearchTerm && parameters.SearchTerm.trim() !== "") {
    url += `&SearchTerm=${(parameters.SearchTerm)}`;
  }
  if (parameters?.PageSize && parameters.PageSize > 0) {
    url += `&PageSize=${parameters.PageSize}`;
  }
  if (parameters?.PageNumber && parameters.PageNumber > 0) {
    url += `&PageNumber=${parameters.PageNumber}`;
  }
  if (parameters?.OrderBy && parameters.OrderBy.trim() !== "") {
    url += `&OrderBy=${(parameters.OrderBy)}`;
  }
  try {
   const response = await api.get(url);
    if (response.status === 200) {
      const headers = response.headers["x-pagination"];
      const parsedHeader: ResponseHeaders = JSON.parse(headers);
      const applications : JobApplication[] = response.data;
     const data : JobApplicationResponse =   {
        headers: parsedHeader,
       jobApplications: applications,
     };
     return data;
    } else {
      console.error("Error fetching job applications:", response.statusText);
    }

  } catch (error) {
    console.error("Error fetching job applications:", error);
  }

}

export default FetchJobApplications;
