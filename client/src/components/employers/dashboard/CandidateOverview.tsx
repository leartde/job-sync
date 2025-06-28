import React, { useEffect, useState } from 'react';
import { JobApplication } from "../../../types/jobapplication/JobApplication.ts";
import { FaCalendar, FaFile, FaPhone } from "react-icons/fa6";
import { FaMailBulk } from "react-icons/fa";
import { statusStyles } from "../../../utils/StatusStyles.ts";
import { Link } from "react-router-dom";
import InitialsProfile from "../../shared/InitialsProfile.tsx";
import UpdateJobApplication from "../../../services/jobapplication/UpdateJobApplication.ts";

const ContactDetails = ({ application }: { application: JobApplication | undefined }) => {
  return (
    <div className="flex justify-between border-b border-gray-600">
      <div className="flex gap-4 pb-4">
        <div className="h-16 w-16">
          <InitialsProfile name={application?.candidate} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{application?.candidate}</h2>
          <div className="flex  items-center gap-1">
            <FaMailBulk/>
            <p className="text-md text-gray-300">
              {application?.email}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <FaPhone/>
            <p className="text-md text-gray-300">
              {application?.phone}
            </p>
          </div>
        </div>
      </div>
      <div className={`${statusStyles[application?.statusString]} p-2`}>
        {application?.statusString}
      </div>
    </div>
  );
};

type ApplicationDetailsProps = {
  application: JobApplication | undefined;
  status: number | undefined;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusUpdate: (e: React.FormEvent) => void;
};

const ApplicationDetails = ({application, status, onStatusChange, onStatusUpdate}: ApplicationDetailsProps) => {
  return (
    <div className="flex md:flex-row flex-col md:justify-between gap-4 px-6">
      <div className="flex flex-col gap-4">
        <p className="text-md font-semibold">Application Details</p>
        <div className="flex  items-center gap-1">
          <FaCalendar/>
          <p className="text-md text-gray-300">
            Applied on {new Date(application?.createdAt ?? "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <FaFile/>
          <p className="text-md text-gray-300">
            Resume: {
            application?.resumeLink ? (
              <Link to={application.resumeLink} target="_blank" className="text-blue-300 hover:text-blue-500">
                View Resume
              </Link>
            ) : (
              "No resume uploaded"
            )
          }
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-md font-semibold">Update Status</p>
        <form onSubmit={onStatusUpdate} className="flex flex-col gap-2">
          <select
            value={status}
            onChange={onStatusChange}
            className="bg-gray-300 px-2 py-1 rounded-md text-black pr-16"
          >
            <option value="0">Submitted</option>
            <option value="1">Reviewed</option>
            <option value="2">Interview</option>
            <option value="3">Hired</option>
            <option value="4">Rejected</option>
          </select>
          <button
            type="submit"
            disabled={status === application?.status}
            className={`${status === application?.status ? 'bg-gray-600 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-900'} text-white px-4 py-1 rounded-md`}
          >
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
};

const CandidateOverview = ({ application: initialApplication }: { application: JobApplication | undefined }) => {
  const [application, setApplication] = useState(initialApplication);
  const [status, setStatus] = useState<number | undefined>(initialApplication?.status);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (initialApplication) {
      setApplication(initialApplication);
      setStatus(initialApplication.status);
    }
  }, [initialApplication]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (application && status !== undefined && status !== application.status) {
      try {
        const res = await UpdateJobApplication(
          application.employerId,
          application.jobId,
          application.jobSeekerId,
          status
        );
        if (res.status === 200) {
          const updatedApplication = {
            ...application,
            status,
            statusString: getStatusString(status),
          };
          setApplication(updatedApplication);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    setLoading(false);
  };

  const getStatusString = (status: number): string => {
    const statusMap = {
      0: "Submitted",
      1: "Reviewed",
      2: "Interview",
      3: "Hired",
      4: "Rejected",
    };
    return statusMap[status] || "Submitted";
  };

  if (loading) return (
    <div className="fixed h-64 w-64 self-center bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Updating application status...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col p-4 border border-gray-600 gap-8">
      <ContactDetails application={application} />
      <ApplicationDetails
        application={application}
        status={status}
        onStatusChange={handleStatusChange}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default CandidateOverview;
