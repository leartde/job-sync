import React from 'react';
import { JobApplication } from "../../../types/jobapplication/JobApplication.ts";
import { FaMailBulk } from "react-icons/fa";
import {  FaPhone } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Applicants = ({applications}:{applications:JobApplication[] | undefined}) => {
  const statusStyles = {
    Submitted: "text-blue-500",
    Reviewed: "text-green-500",
    Interview: "text-orange-500",
    Hired: "text-yellow-500",
    Rejected: "text-red-500",
    Closed: "text-gray-300"
  }
  if (!applications) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <div className="flex flex-col md:w-3/5 text-white border border-gray-600 rounded-lg shadow-sm">
      <div className="border-b border-gray-600 px-2 py-1">
        <h2 className="text-xl py-2"> Applicants ({applications?.length})</h2>
      </div>
      <div className="flex flex-col">
        {applications?.length === 0 ? (
          <p className="text-gray-400">No applicants yet.</p>
        ) : (
          applications?.map((application) => (
            <div key={application.jobSeekerId} className="flex flex-col border border-gray-600">
              <div
                   className=" flex lg:flex-row flex-col gap-2 md:justify-between p-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{application.candidate}</h3>
                  <div className="flex items-center text-gray-300 gap-2 text-md">
                    <FaMailBulk/>
                    <p>{application.email}</p>
                  </div>
                  <div className="flex items-center text-gray-300 gap-2 text-md">
                    <FaPhone/>
                    <p>{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex p-1">
                    <p
                      className={`${statusStyles[application.statusString]} text-sm bg-gray-800 text-md  px-2 rounded-md`}>{application.statusString}</p>
                  </div>
                </div>
              </div>
                <div className="p-2">
                <Link
                  to=""
                  className="text-blue-300 hover:text-blue-500"
                >
                  View Details
                </Link>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applicants;
