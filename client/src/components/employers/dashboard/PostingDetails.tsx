import React from 'react';
import { Job } from "../../../types/job/Job.ts";
import { FaBusinessTime, FaCalendar, FaDollarSign, FaMapPin } from "react-icons/fa6";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

const JobOverview = ({job}: { job: Job | undefined }) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-700">

      <div className="flex items-center">
        <FaMapPin className="text-white mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Location</p>
          <p className="text-white">{job?.city ?? "Remote"}</p>
        </div>
      </div>


      <div className="flex items-center">
        <FaCalendar className="text-white mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Posted</p>
          <p className="text-white">{new Date(job?.createdAt ?? "").toLocaleDateString()}</p>
        </div>
      </div>


      <div className="flex items-center">
        <FaBusinessTime className="text-white mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Type</p>
          <p className="text-white">{separateCamelCase(job?.type)}</p>
        </div>
      </div>


      <div className="flex items-center">
        <FaDollarSign className="text-white mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Salary</p>
          <p className="text-white">{job?.pay || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
};

const PostingDetails = ({ job }: { job: Job | undefined }) => {
  return (
    <div className="flex flex-col p-6 border border-gray-700 rounded-lg md:w-3/5 shadow-lg">

      <div className="flex gap-2">
        {job?.imageUrl && <img alt="photo" src={job?.imageUrl} className="h-16 w-16 rounded-md"/>}
        <h1 className="text-3xl font-bold text-white mb-2">{job?.title}</h1>
      </div>

      <JobOverview job={job}/>

      <div className="mt-4">

      <h3 className="text-xl font-semibold text-white mb-3">Job Description</h3>
        <div className="text-white">
          <div className="w-full overflow-x-auto p-2">
            <div
              className="break-words whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: job?.description || '' }}
            />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-white mb-3">Skills Required</h3>
          <ul className="list-disc list-inside text-gray-300">
            {job?.skills?.length ? job.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            )) : <li>No skills specified</li>}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-white mb-3">Benefits</h3>
          <ul className="list-disc list-inside text-gray-300">
            {job?.benefits?.length ? job.benefits.map((benefit, index) => (
              <li key={index}>{separateCamelCase(benefit)}</li>
            )) : <li>No benefits specified</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostingDetails;
