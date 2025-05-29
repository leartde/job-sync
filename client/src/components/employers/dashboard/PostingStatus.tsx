import React, { useEffect, useState } from 'react';
import { Job } from "../../../types/job/Job.ts";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

type PostingStatusProps = {
  job: Job | undefined;
  applicationsCount: number;
}

const PostingStatus = ({job, applicationsCount}:PostingStatusProps) => {

  return (
    <div className="flex flex-col gap-2 py-2 px-8 text-white border border-gray-600 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold"> Job Status</h2>

          <p className="text-sm bg-gray-800 rounded-md text-md py-1 text-center">
            {job?.isTakingApplications ? "Open for Applications" : "Closed for Applications" }
          </p>

      <p className="text-md mt-2">Applications Received:</p>
      <p className="text-lg font-semibold"> {applicationsCount}</p>

      <div className="flex flex-col gap-2">
        <Link className="flex rounded-md hover:bg-red-400 text-md items-center justify-center gap-1 py-1 px-2 bg-red-500 text-white" to="" > <FaEdit/> Edit Job</Link>
        <button className="flex rounded-md hover:bg-gray-800 text-md items-center justify-center gap-1 py-1 px-2 bg-gray-900 text-white"> <FaTrash/> Delete Job </button>
      </div>
    </div>
  );
};

export default PostingStatus;
