import JobCardsColumn from '../../components/jobs/JobCardsColumn.tsx';
import Preview from '../../components/jobs/preview/Preview.tsx';
import { useEffect, useState } from "react";
import FetchAllJobs  from "../../services/job/FetchAllJobs.ts";
import { MainJobProvider } from "../../context/jobs/MainJobContext.tsx";
import { useSearchParams } from "react-router-dom";
import { useMainJobContext } from "../../hooks/jobs/useMainJobContext.ts";
import FetchJob from "../../services/job/FetchJob.ts";
import { JobParametersProvider } from "../../context/jobs/JobParametersContext.tsx";
import { useJobParametersContext } from "../../hooks/jobs/useJobParametersContext.ts";
import { Job } from "../../types/job/Job.ts";
import JobsPagination from "../../components/jobs/filters/JobsPagination.tsx";
import { JobResponse } from "../../types/job/JobResponse.ts";
import { useJobResponseHeadersContext } from "../../hooks/jobs/useJobResponseHeadersContext.ts";
import { JobResponseHeadersProvider } from "../../context/jobs/JobResponseHeadersContext.tsx";
import Filters from "../../components/jobs/filters/Filters.tsx";
import JobSearch from "../../components/jobs/filters/JobSearch.tsx";



const HomePageContent = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const { updateMainJob } = useMainJobContext();
    const { jobParameters } = useJobParametersContext();
    const { updateHeaders } = useJobResponseHeadersContext();
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
    if (urlParams.searchTerm){
        jobParameters.SearchTerm = urlParams.searchTerm;
    }
    if(urlParams.pageNumber){
        jobParameters.PageNumber = parseInt(urlParams.pageNumber);
    }
    if (urlParams.jobType){
        jobParameters.JobType = urlParams.jobType;
    }
    if (urlParams.isRemote){
        jobParameters.IsRemote = urlParams.isRemote === 'true';
    }
    if (urlParams.hasMultipleSpots){
        jobParameters.HasMultipleSpots = urlParams.hasMultipleSpots === 'true';
    }
    if (urlParams.minimumPay){
        jobParameters.MinimumPay = parseFloat(urlParams.minimumPay);
    }
        const getData = async () => {
            try {
                const data: JobResponse = await FetchAllJobs(jobParameters);
                if (data?.jobs) {
                    setJobs(data.jobs);
                    updateHeaders(data.headers);
                    if (urlParams.jobId && urlParams.employerId) {
                        const selectedJob = await FetchJob(urlParams.employerId, urlParams.jobId);
                        if (selectedJob) {
                            updateMainJob(selectedJob);
                        }
                    } else if (data.jobs.length > 0) {
                        updateMainJob(data.jobs[0]);
                        setSearchParams(prev =>{
                            const newParams = new URLSearchParams(prev);
                            newParams.set('jobId', data.jobs[0].id);
                            newParams.set('employerId', data.jobs[0].employerId);
                            return newParams;
                        });
                    }
                } else {
                    console.error("Data is undefined or job are missing.");
                }
            } catch (error) {
                console.error("Error in getData: ", error);
            }
        };

        getData().then();
    }, [urlParams.jobId, urlParams.employerId, jobParameters.SearchTerm, jobParameters.PageNumber, jobParameters.IsRemote, jobParameters.HasMultipleSpots, jobParameters.JobType, jobParameters.OrderBy, jobParameters.PageSize, jobParameters.MinimumPay, jobParameters.IsTakingApplications]);


    return (
        <div className='flex flex-col gap-4 '>
            <JobSearch/>
            <Filters/>
            <div className=" max-md:flex-col-reverse md:space-x-8 relative top-12 flex w-3/4 mx-auto  ">
                <JobCardsColumn jobs={jobs}/>
                <Preview/>
            </div>
            <JobsPagination/>
        </div>
    );
}

const HomePage = () => {
    return (
        <JobParametersProvider>
            <JobResponseHeadersProvider>
                <MainJobProvider>
                    <HomePageContent />
                </MainJobProvider>
            </JobResponseHeadersProvider>
        </JobParametersProvider>
    );
}

export default HomePage;
