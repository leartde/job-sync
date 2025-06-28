import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, } from "react-router-dom";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import { Job } from "../../types/job/Job.ts";
import fetchJob from "../../services/job/FetchJob.ts";
import PostingDetails from "../../components/employers/dashboard/PostingDetails.tsx";
import PostingStatus from "../../components/employers/dashboard/PostingStatus.tsx";
import { JobApplication } from "../../types/jobapplication/JobApplication.ts";
import FetchJobApplications from "../../services/jobapplication/FetchJobApplications.ts";
import Applicants from "../../components/employers/dashboard/Applicants.tsx";
import { JobApplicationParametersProvider } from "../../context/jobapplications/JobApplicationParametersContext.tsx";
import useJobApplicationParametersContext from "../../hooks/jobapplications/useJobApplicationParametersContext.ts";
import {
  JobApplicationResponseHeadersProvider
} from "../../context/jobapplications/JobApplicationResponseHeadersContext.tsx";
import useJobApplicationsResponseHeadersContext
  from "../../hooks/jobapplications/useJobApplicationsResponseHeadersContext.ts";
import * as XLSX from 'xlsx';
import { FaFileExcel } from "react-icons/fa6";
const JobPostingContent = () => {
  const { user } = useAuth();
  const [searchParams,] = useSearchParams();
  const { id } = useParams()
  const [job, setJob] = useState<Job>();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [xlApplications, setXlApplications] = useState<JobApplication[]>([]);
  const { jobApplicationParameters } = useJobApplicationParametersContext();
  const { updateHeaders } = useJobApplicationsResponseHeadersContext();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const  urlParams = {
    searchTerm: searchParams.get("searchTerm"),
    pageNumber: searchParams.get("pageNumber"),
    hasResume: searchParams.get("hasResume"),
    orderBy: searchParams.get("orderBy"),
    pageSize: searchParams.get("pageSize")
  };

  useEffect(() => {
    const getJob = async ()=>{
      if(user && id){
        const job = await fetchJob(user.id, id);
        setJob(job)
      }
    }
    getJob().then();
  }, [user, id]);
  useEffect(() => {
    if (urlParams.searchTerm) {
      jobApplicationParameters.SearchTerm = urlParams.searchTerm;
    }
    if (urlParams.pageNumber) {
      jobApplicationParameters.PageNumber = parseInt(urlParams.pageNumber);
    }
    if (urlParams.hasResume) {
      jobApplicationParameters.HasResume = urlParams.hasResume === 'true';
    }
    if (urlParams.orderBy) {
      jobApplicationParameters.OrderBy = urlParams.orderBy;
    }
    if (urlParams.pageSize) {
      jobApplicationParameters.PageSize = parseInt(urlParams.pageSize);
    }
    const getApplications = async () =>{
      if (user && job){
        const res = await FetchJobApplications(user.id, job.id,jobApplicationParameters);
        if (res) {
          setApplications(res.jobApplications);
          updateHeaders(res.headers);
          setCount(res.headers.TotalCount);
        }
      }
    }
    getApplications().then();
  }, [job, user, jobApplicationParameters,urlParams.searchTerm, urlParams.hasResume, urlParams.orderBy, urlParams.pageNumber, urlParams.pageSize]);


  const downloadExcel = async () => {
    setLoading(true);
    if (user && job) {
      const res = await FetchJobApplications(user.id, job.id, {
        PageSize: 1000,
      });
      if (res) {
        setXlApplications(res.jobApplications);
      }

    }
    const worksheet = XLSX.utils.json_to_sheet(xlApplications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "applications.xlsx");
    setLoading(false);
  };


  return (
    <div className="flex flex-col mt-4 md:w-[90%] mx-auto p-4 gap-8">
      {loading && <div className="flex bg-white px-2 py-1 items-center border border-gray-300">
             Downloading applications as Excel sheets...
      </div>}
      <div className="flex flex-col-reverse md:flex-row  gap-12">
        <PostingDetails job={job}/>
        <PostingStatus job={job} applicationsCount={count}/>
      </div>
      <div className="flex items-center">
        <button className="bg-green-700 hover:bg-green-800 flex items-center gap-1 text-white px-2 py-1 rounded-md" onClick={downloadExcel}
                disabled={loading}>
          Download Applications as Excel Sheets
          <FaFileExcel/>
        </button>
      </div>
      <Applicants count={count} applications={applications}/>
    </div>
  );
};

const JobPosting = () => {
  return (
    <JobApplicationParametersProvider>
      <JobApplicationResponseHeadersProvider>
        <JobPostingContent/>
      </JobApplicationResponseHeadersProvider>
    </JobApplicationParametersProvider>
    )
}

export default JobPosting;
