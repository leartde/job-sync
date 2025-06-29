import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Job } from "../../types/job/Job.ts";
import FetchJob from "../../services/job/FetchJob.ts";
import { separateCamelCase } from "../../helpers/StringHelpers.ts";
import ReviewJob from "../../services/job/ReviewJob.ts";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";

const PendingJobs = () => {
  const { jobId, employerId } = useParams();
  const [job, setJob] = useState<Job>()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId || !employerId) return;
    const getJob = async () => {
      const res = await FetchJob(employerId, jobId);
      setJob(res);
    }
    getJob().then();
  }, [jobId, employerId]);

  const reviewJob = async (status: 1 | 2) => {
    setLoading(true);
    if (!employerId || !jobId) return;
    const res = await ReviewJob(employerId, jobId, status);
    if (res.status === 200) {
      toast.success(status === 1 ? "Job approved." : "Job rejected.");
      navigate("/admin/pending-jobs");
    }
    setLoading(false);
  }

  return (
    <div className="w-[90%] bg-gray-800 mt-2 rounded-md border-red-500 border-2 shadow-md mx-auto">
      {loading &&
        <div className="flex justify-center items-center h-64">
          <ImSpinner8 className="animate-spin text-4xl text-red-500" />
        </div>
      }
      <div className="gap-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-4 text-prettyGray">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Job Details</h2>
          {job ? (
            <div className="space-y-4">
              {job.imageUrl &&
                <div className="w-16 h-16">
                  <img alt="logo" src={job.imageUrl} className="w-full h-full rounded-md"/>
                </div>
              }
              <p><strong>Title:</strong> {job.title}</p>
              <p><strong>Company:</strong> {job.employer}</p>
              <p><strong>Location:</strong> {job.address}</p>
              <p><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-400">Loading job details...</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p><strong>Pay:</strong> {job?.pay}</p>
            <p><strong>Type:</strong> {separateCamelCase(job?.type)}</p>
            <p><strong>Hiring Multiple Candidates:</strong> {job?.hasMultipleSpots ? "Yes" : "No"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Job Description:</h3>
            <div className="text-sm text-gray-300 bg-gray-700/10 p-3 rounded-md h-40 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: job?.description || '' }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Skills Required</h3>
            <div className="text-sm flex-wrap text-gray-300 bg-gray-700/10 p-3 rounded-md h-40">
              {job?.skills?.map((skill) => (
                <span key={skill} className="inline-block bg-gray-600/30 text-gray-200 px-2 py-1 m-1 rounded-md">
                  {separateCamelCase(skill)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Benefits Provided</h3>
            <div className="text-sm flex-wrap text-gray-300 bg-gray-700/10 p-3 rounded-md h-40">
              {job?.benefits?.map((benefit) => (
                <span key={benefit} className="inline-block bg-gray-600/30 text-gray-200 px-2 py-1 m-1 rounded-md">
                  {separateCamelCase(benefit)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-2 flex gap-4">
        <button
          onClick={() => reviewJob(1)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          type="button"
        >
          Approve
        </button>
        <button
          onClick={() => reviewJob(2)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          type="button"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default PendingJobs;
