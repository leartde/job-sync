import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { JobApplication } from "../../types/jobapplication/JobApplication.ts";
import FetchJobApplication from "../../services/jobapplication/FetchJobApplication.ts";
import CandidateOverview from "../../components/employers/dashboard/CandidateOverview.tsx";
import CandidateSkills from "../../components/employers/dashboard/CandidateSkills.tsx";
import { Job } from "../../types/job/Job.ts";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import FetchJob from "../../services/job/FetchJob.ts";
import { FaAlignLeft, FaArrowLeft } from "react-icons/fa6";

const ApplicationDetails = () => {
  const { user } = useAuth();
  const { id } = useParams()
  const { jobSeekerId } = useParams()
  const [application, setApplication] = useState<JobApplication>();
  const [job, setJob] = useState<Job>();
  useEffect(() => {
    const getApplication = async () => {
      if (id && jobSeekerId) {
        const res = await FetchJobApplication(id, jobSeekerId);
        if(res.status === 200){
          setApplication(res.data);
        }
      }
    };
    getApplication().then();
  }, [id, jobSeekerId]);

  useEffect(() => {
    const getJob = async ()=>{
      if(user && id){
        const res = await FetchJob(user.id, id);
        setJob(res)
      }
    }
    getJob().then();
  }, [user, id]);
  return (
    <div className="lg:w-1/2 md:w-3/4 w-[95%] mt-8 mx-auto flex flex-col gap-12  shadow-md text-white">
      <div className="flex w-full gap-4 px-4 border-b border-gray-700 rounded-lg">
        <Link className="flex items-center  gap-1 text-md text-gray-500" to={`/employer-dashboard/jobs/${id}`}><FaArrowLeft/> Back to job</Link>
        <h1 className="text-2xl font-bold text-white">Applicant Details</h1>
      </div>
      <CandidateOverview application={application} />
      <CandidateSkills jobSkills={job?.skills} candidateSkills={application?.skills} />

    </div>
  );
};

export default ApplicationDetails;
