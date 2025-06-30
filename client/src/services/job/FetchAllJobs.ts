import api from "../../utils/api";
import { Job } from "../../types/job/Job.ts";
import { JobParameters } from "../../types/job/JobParameters.ts";
import { JobResponse } from "../../types/job/JobResponse.ts";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";


const FetchJobs = async ({JobType, SearchTerm, HasMultipleSpots, IsTakingApplications, MinimumPay, IsRemote, PageSize, PageNumber, Pending } : JobParameters) => {
    let url = Pending?`jobs/pending?`:`jobs?`;

  if(PageSize && PageSize > 0){
    url += `PageSize=${PageSize}`;
  }
  if(JobType && JobType.trim() != ""){
    url += `&JobType=${JobType}`;
  }
  if(SearchTerm && SearchTerm.trim() != ""){
    url += `&SearchTerm=${SearchTerm}`;
  }
  if(HasMultipleSpots){
    url += `&HasMultipleSpots=${HasMultipleSpots}`;
  }
  if (MinimumPay && MinimumPay > 0){
    url += `&MinimumPay=${MinimumPay}`;
  }
  if (IsRemote){
    url += `&IsRemote=${IsRemote}`;
  }
  if(IsTakingApplications){
    url += `&IsTakingApplications=${IsTakingApplications}`;
  }
  // if(OrderBy && OrderBy.trim() != ""){
  //   url += `&OrderBy=${OrderBy}`;
  // }
  if(PageNumber && PageNumber > 0){
    url += `&PageNumber=${PageNumber}`;
  }
    try{
        const response = await api.get(url);
        if(response.status === 200){
            const headers = response.headers["x-pagination"];
            const parsedHeader : ResponseHeaders = JSON.parse(headers);
            const jobs: Job[] = response.data;
            const data : JobResponse =  {
                jobs: jobs,
                headers: parsedHeader
            }
            return data;
        }
        else{
            console.error("Error fetching jobs: ", response.statusText);
        }
    }
    catch (e)
    {
        console.error("Error fetching jobs: ", e);
    }
}

export default FetchJobs;
