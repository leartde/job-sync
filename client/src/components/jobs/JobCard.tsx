import {  FaDollarSign } from "react-icons/fa6";
import { Job } from "../../types/job/Job.ts";
import React from "react";

type JobCardParams = {
  job: Job;
  onClick: () => void;
};

const JobCard = ({ job, onClick }: JobCardParams) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col w-full max-w-sm h-[24rem] bg-white border border-gray-300 rounded-xl shadow-md p-6 hover:shadow-lg transition"
    >
      <div className="flex justify-between items-start">
        <h1 className="text-lg text-black font-semibold text-left line-clamp-2">{job.title}</h1>
        <p className="text-sm font-medium flex items-center text-gray-900/80">
          <FaDollarSign/>  {job.hourlyPay}/hour

        </p>
      </div>

      <div className="text-sm text-gray-700 mt-2 space-y-1 text-left">
        <p className="line-clamp-1">{job.employer}</p>
        <p className="line-clamp-1">{job.address}</p>
      </div>

      <div className="mt-4 text-sm  overflow-y-auto max-h-40 pr-1 text-left">
        <div
          dangerouslySetInnerHTML={{ __html: job.description || '' }}
        />
      </div>
    </button>
  );
};

export default JobCard;
