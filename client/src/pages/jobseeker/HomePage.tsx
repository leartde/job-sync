import JobCardsColumn from '../../components/jobs/JobCardsColumn.tsx';
import Preview from '../../components/jobs/preview/Preview.tsx';
import { useEffect, useState } from "react";
import FetchAllJobs  from "../../services/job/FetchAllJobs.ts";
import { useSearchParams } from "react-router-dom";
import FetchJob from "../../services/job/FetchJob.ts";
import { Job } from "../../types/job/Job.ts";
import { JobResponse } from "../../types/job/JobResponse.ts";
import Filters from "../../components/jobs/filters/Filters.tsx";
import JobSearch from "../../components/jobs/filters/JobSearch.tsx";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import Pagination from "../../components/shared/Pagination.tsx";



const HomePage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [mainJob, setMainJob] = useState<Job | null>(null);
    const [headers, setHeaders] = useState<ResponseHeaders>({
        HasNext: false,
        HasPrevious: false,
        PageSize: 10,
        TotalPages: 0,
        CurrentPage: 1,
        TotalCount: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const urlParams = {
    jobId: searchParams.get('jobId'),
    employerId: searchParams.get('employerId'),
    searchTerm: searchParams.get('searchTerm'),
    pageNumber: searchParams.get('pageNumber'),
    jobType: searchParams.get('jobType'),
    isRemote: searchParams.get('isRemote'),
    hasMultipleSpots: searchParams.get('hasMultipleSpots'),
    minimumPay: searchParams.get('minimumPay')
}

  useEffect(() => {
    const params = {
      SearchTerm: urlParams.searchTerm || '',
      PageNumber: urlParams.pageNumber ? parseInt(urlParams.pageNumber) : 1,
      JobType: urlParams.jobType || '',
      IsRemote: urlParams.isRemote === 'true',
      HasMultipleSpots: urlParams.hasMultipleSpots === 'true',
      MinimumPay: urlParams.minimumPay ? parseFloat(urlParams.minimumPay) : 0,
      PageSize: 10,
      Pending: false,
      IsTakingApplications: true,
      JobId: urlParams.jobId,
      EmployerId: urlParams.employerId,
    };

    const getData = async () => {
      try {
        const data: JobResponse = await FetchAllJobs(params);
        if (data.jobs) {
          setJobs(data.jobs);
          setHeaders(data.headers);
          if (params.JobId && params.EmployerId) {
            const selectedJob = await FetchJob(urlParams.employerId, urlParams.jobId);
            if (selectedJob) {
              setMainJob(selectedJob);
              return;
            }
          }

          if (data.jobs.length > 0) {
            setMainJob(data.jobs[0]);
            setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('employerId', data.jobs[0].employerId);
              newParams.set('jobId', data.jobs[0].id);
              return newParams;
            } );
          }
        } else {
          console.error("Data is undefined or jobs are missing.");
        }
      } catch (error) {
        console.error("Error in getData: ", error);
      }
    };
    getData().then();
  }, [
    urlParams.employerId,
    urlParams.hasMultipleSpots,
    urlParams.isRemote,
    urlParams.jobId,
    urlParams.jobType,
    urlParams.minimumPay,
    urlParams.pageNumber,
    urlParams.searchTerm,
    setSearchParams
  ]);

  return (
        <div className='flex flex-col gap-4'>
            <div className="w-4/5 mx-auto">
              <JobSearch/>
            </div>
            <Filters/>
            <div className="max-md:flex-col-reverse md:space-x-8 relative top-12 flex w-3/4 mx-auto  ">
                <JobCardsColumn updateMainJob={setMainJob} jobs={jobs}/>
                <Preview mainJob={mainJob}/>
            </div>
            <Pagination headers={headers}/>
        </div>
    );
}


export default HomePage;
