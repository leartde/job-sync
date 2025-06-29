import React from 'react';
import { JobApplication } from "../../../types/jobapplication/JobApplication.ts";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { statusStyles } from "../../../utils/StatusStyles.ts";
import Pagination from "../../shared/Pagination.tsx";
import { ResponseHeaders } from "../../../types/ResponseHeaders.ts";

type ApplicantsProps = {
  applications: JobApplication[] | undefined;
  count: number;
  headers: ResponseHeaders;
};

const Applicants = ({ applications, count, headers }: ApplicantsProps) => {
  if (!applications) {
    return <div className="p-4 text-gray-400">Loading applicants...</div>;
  }

  return (
    <div className="flex flex-col border border-gray-700 rounded-lg  shadow-lg overflow-hidden">

      <div className="px-6 py-4 border-b border-gray-700 ">
        <h2 className="text-2xl font-bold text-white">
          Applicants ({count})
        </h2>
      </div>


      {applications.length === 0 ? (
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-2">No applicants yet</div>
          <p className="text-gray-400 text-sm">Check back later or share this job posting</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {applications.map((application) => (
            <div key={application.jobSeekerId} className="hover:bg-gray-700/50 transition-colors duration-150">
              <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-gray-700 text-blue-400">
                        <FaUser className="text-lg" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{application.candidate}</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                      <div className="flex items-center text-gray-300 gap-2">
                        <FaEnvelope/>
                        <p className="text-sm">{application.email}</p>
                      </div>
                      <div className="flex items-center text-gray-300 gap-2">
                        <FaPhone />
                        <p className="text-sm">{application.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className={`${statusStyles[application.statusString]} px-3 py-1 rounded-full text-xs font-medium`}>
                      {application.statusString}
                    </div>
                    <Link
                      to={`candidates/${application.jobSeekerId}`}
                      className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Full Profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-700">
        <Pagination  headers={headers}/>
      </div>
    </div>
  );
};

export default Applicants;
