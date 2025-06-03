import React from 'react';
import { Job } from "../../../types/job/Job.ts";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

type PostingStatusProps = {
  job: Job | undefined;
  applicationsCount: number;
}

const PostingStatus = ({ job, applicationsCount }: PostingStatusProps) => {
  return (
    <div className="flex flex-col gap-4 p-6 border border-gray-700 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Job Posting Status</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-300">Current Status:</p>
          <span className={`text-sm font-semibold py-2 px-3 rounded-md text-center ${
            job?.isTakingApplications
              ? " text-green-400 border border-green-800"
              : " text-red-400 border border-red-800"
          }`}>
            {job?.isTakingApplications ? "🟢 Open for Applications" : "🔴 Closed for Applications"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-300">Applications Received:</p>
          <div className="text-2xl font-bold text-blue-400 py-1 px-3 rounded-md border border-blue-500">
            {applicationsCount}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Link
            to=""
            className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
          >
            <FaEdit className="text-sm" />
            <span>Edit Job Posting</span>
          </Link>
          <button
            className="flex items-center justify-center gap-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
          >
            <FaTrash className="text-sm" />
            <span>Delete Job Posting</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostingStatus;
