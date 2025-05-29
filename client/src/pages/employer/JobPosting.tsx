import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import { Job } from "../../types/job/Job.ts";
import fetchJob from "../../services/job/FetchJob.ts";
import PostingDetails from "../../components/employers/dashboard/PostingDetails.tsx";
import PostingStatus from "../../components/employers/dashboard/PostingStatus.tsx";
import { JobApplication } from "../../types/jobapplication/JobApplication.ts";
import FetchJobApplications from "../../services/jobapplication/FetchJobApplications.ts";
import Applicants from "../../components/employers/dashboard/Applicants.tsx";

const JobPosting = () => {
  const { user } = useAuth();
  const [searchParams,] = useSearchParams();
  const jobId = searchParams.get("id");
  const [job, setJob] = useState<Job>();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  useEffect(() => {
    const getJob = async ()=>{
      if(user && jobId){
        const job = await fetchJob(user.id, jobId);
        setJob(job)
      }
    }
    getJob().then();
  }, [user, jobId]);
  useEffect(() => {
    const getApplications = async () =>{
      if ( user && job){
        const res = await FetchJobApplications(user.id, job.id);
        if (res.status  === 200) {
          setApplications(res.data);
        }
      }
    }
    getApplications().then();
  }, [user, job]);
  return (
    <div className="flex flex-col mt-4 md:w-[90%] mx-auto p-4 gap-8">
      <div className="flex flex-col-reverse md:flex-row   gap-12">
        <PostingDetails job={job}/>
        <PostingStatus job={job} applicationsCount={applications.length} />
      </div>
      <Applicants applications={applications}/>
    </div>
  );
};

export default JobPosting;
