import api from "../../utils/api.ts";
import { JobParameters } from "../../types/job/JobParameters.ts";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { Job } from "../../types/job/Job.ts";
import { JobResponse } from "../../types/job/JobResponse.ts";


const FetchJobsForEmployer = async (id: string,{PageSize, PageNumber,SearchTerm}:JobParameters) => {
    let url = `/employers/${id}/jobs`;
    if (PageSize && PageSize > 0) {
        url += `?PageSize=${PageSize}`;
    }
    if (PageNumber && PageNumber > 0) {
        url += `&PageNumber=${PageNumber}`;
    }
    if (SearchTerm && SearchTerm.trim() !== "") {
        url += `&SearchTerm=${encodeURIComponent(SearchTerm)}`;
    }
    try {
        const response =  await api.get(url);
        if (response.status === 200){
            const headers = response.headers["x-pagination"];
            const parsedHeader : ResponseHeaders = JSON.parse(headers);
            const jobs: Job[] = response.data;
            const data : JobResponse =  {
                jobs: jobs,
                headers: parsedHeader
            }
            return data;
        }
        else {
            console.error("Error fetching jobs for employer: ", response.statusText);
        }
    }
    catch (e) {
        console.error("Error fetching jobs for employer: ", e);
    }
}

export default FetchJobsForEmployer;