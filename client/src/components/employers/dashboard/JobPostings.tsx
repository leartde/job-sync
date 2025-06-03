import React, { useEffect, useState } from 'react';
import { Employer } from "../../../types/employer/Employer.ts";
import { Job } from "../../../types/job/Job.ts";
import FetchJobsForEmployer from "../../../services/job/FetchJobsForEmployer.ts";
import { Link, useSearchParams } from "react-router-dom";
import { FaCalendar, FaDollarSign, FaMapPin } from "react-icons/fa6";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import JobsPagination from "../../jobs/filters/JobsPagination.tsx";
import { useJobResponseHeadersContext } from "../../../hooks/jobs/useJobResponseHeadersContext.ts";
import SearchBar from "../../SearchBar.tsx";

type JobPostingsProps = {
    employer: Employer | undefined
}
const JobPostings = ({employer}:JobPostingsProps) => {
    const [jobs, setJobs] = useState<Job[]>();
    const { jobParameters, updateJobParameters } = useJobParametersContext();
    const { updateHeaders } = useJobResponseHeadersContext();
    const [searchParams,] = useSearchParams();

    const urlParams = {
        searchTerm: searchParams.get('searchTerm'),
        pageNumber: searchParams.get('pageNumber'),
    }

    useEffect(() => {
        if (urlParams.searchTerm) {
            jobParameters.SearchTerm = urlParams.searchTerm;
        }
        if (urlParams.pageNumber) {
            jobParameters.PageNumber = parseInt(urlParams.pageNumber);
        }
        jobParameters.PageSize = 4;

        const getJobs = async()=>{
            const res = await FetchJobsForEmployer(employer?.id ??"",jobParameters);
            setJobs(res.jobs)
            updateHeaders(res.headers);
        }
        getJobs().then();
    }, [employer, jobParameters, urlParams.pageNumber, urlParams.searchTerm]);
    return (
        <div className="flex flex-col p-4 gap-4 w-full">

                <div className="flex items-center">
                  <SearchBar placeholder="Search" updateParameters={updateJobParameters}/></div>
            <div className="flex flex-col">
            {jobs?.map((job)=>(
                    <div key={job.id} className="border flex flex-col gap-4 justify-between p-4 rounded-md mb-4">
                        <div className="w-full flex justify-between">
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm bg-gray-800 rounded-md p-2">{separateCamelCase(job.type)}</p>
                        </div>
                        <div className="flex text-sm items-center">
                            <FaMapPin/>
                            <p className="ml-2">{job.city ?? "remote"}</p>
                        </div>
                        <div className="flex text-sm items-center">
                            <FaDollarSign/>
                            <p className="ml-2">{job.pay}</p>
                        </div>
                        <div className="flex text-sm items-center">
                            <FaCalendar/>
                            <p className="ml-2">{job.createdAt}</p>
                        </div>
                        <div className="flex gap-2">
                             <Link to={`jobs/${job.id}`} className="bg-red-500 hover:bg-red-400 rounded-md text-md px-6 py-2" >
                                 View Details
                             </Link>
                        </div>
                    </div>
                ))}
            </div>
            <JobsPagination />
        </div>
    );
};

export default JobPostings;
