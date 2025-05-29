import React from 'react';
import { Job } from "../../../types/job/Job.ts";
import { FaBusinessTime, FaCalendar, FaDollarSign, FaMapPin } from "react-icons/fa6";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

const JobOverview = ({job}: { job: Job | undefined }) => {
  return(
    <>
      <div className="flex md:w-1/2 justify-between">
        <div className="flex justify-around items-center">
          <FaMapPin/>
          <p className="ml-2">{job?.city ?? "remote"}</p>
        </div>
        <div className="flex  items-center w-28">
          <FaCalendar/>
          <p className="ml-2">{new Date(job?.createdAt ?? "").toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex md:w-1/2 justify-between">
        <div className="flex  items-center">
          <FaBusinessTime/>
          <p className="ml-2">{separateCamelCase(job?.type)}</p>
        </div>
        <div className="flex  items-center w-28">
          <FaDollarSign/>
          <p className="ml-2">{job?.pay}</p>
        </div>
      </div>
    </>
  )
}


const PostingDetails = ({ job }: { job: Job | undefined }) => {
  return (
    <div className="flex flex-col md:w-3/5 gap-2 p-2 text-white border border-gray-600 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold"> {job?.title}</h1>
     <JobOverview job={job}/>
      <h3 className="text-lg mt-2 font-semibold"> Job Description</h3>
      <p className="text-md" >
        {job?.description}
      </p>
    </div>
  );
};

export default PostingDetails;

