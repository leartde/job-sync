import React, { useEffect, useState } from 'react';
import { Job } from "../../types/job/Job.ts";
import FetchJobs from "../../services/job/FetchAllJobs.ts";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/shared/Pagination.tsx";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { FiClock, FiBriefcase, FiUser, FiCalendar } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';
import { separateCamelCase } from "../../helpers/StringHelpers.ts";
import { JobParameters } from "../../types/job/JobParameters.ts";

const PendingJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [responseHeaders, setResponseHeaders] = useState<ResponseHeaders>({
    TotalCount: 0,
    PageSize: 5,
    CurrentPage: 1,
    TotalPages: 0,
    HasPrevious: false,
    HasNext: false
  });
  const [jobParameters, setJobParameters] = useState<JobParameters>({
    PageSize: 5,
    Pending: true,
  });
  useEffect(() => {
    setJobParameters({
      PageSize : 5,
      PageNumber: searchParams.get('pageNumber') ? parseInt(searchParams.get('pageNumber')!) : 1,
      Pending: true,
      SearchTerm: searchParams.get('searchTerm') || '',
    });
  },[searchParams]);

  useEffect(() => {
    const getPendingJobs = async () => {
      setLoading(true);
      try {
        const res = await FetchJobs(jobParameters);
        if (res && res.jobs) {
          setJobs(res.jobs);
          setResponseHeaders(res.headers);
        }
      } catch (error) {
        console.error("Error fetching pending jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    getPendingJobs().then();
  }, [jobParameters]);

  return (
    <div className="w-[90%] mx-auto p-4 text-white">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-200 flex items-center gap-2">
          <FiClock className="text-red-500" />
          Jobs Pending Approval
        </h1>
        {jobs.length > 0 && (
          <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">
            {responseHeaders.TotalCount} Pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ImSpinner8 className="animate-spin text-4xl text-red-500" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 rounded-lg p-5 hover:bg-gray-700/80 transition-all border-l-4 border-red-500 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h2 className="text-xl font-medium text-white">{job.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-300 text-sm">
                    <span className="flex items-center gap-1">
                      <FiUser className="text-red-500" /> {job.employer}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiBriefcase className="text-red-500" /> {separateCamelCase(job.type) || 'Not specified'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-red-500" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  to={`${job.employerId}/${job.id}`}
                  className="flex items-center justify-center lg:justify-end min-w-[120px]"
                >
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-1">
                    Review
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-lg mb-2">
            No pending jobs at the moment
          </div>
          <p className="text-gray-500 text-sm">
            All jobs have been reviewed or there are no new submissions.
          </p>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-8">
          <Pagination
            headers={responseHeaders}
            updateParameters={(pageNumber) => {
              setSearchParams(prev => ({
                ...prev,
                PageNumber: pageNumber.PageNumber
              }));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PendingJobs;
