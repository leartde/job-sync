import React, { useState } from 'react';
import { Job } from "../../../types/job/Job.ts";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import DeleteJob from "../../../services/job/DeleteJob.ts";
import { toast } from "react-toastify";

type PostingStatusProps = {
  job: Job | undefined;
  applicationsCount: number;
}
type DeleteModalProps = {
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteModal = ({onDelete, onCancel}:DeleteModalProps)=>{
  return(
    <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold">Delete Job</h2>
        <p>Are you sure you want to delete this job</p>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onDelete} className="hover:bg-red-400 bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
          <button type="button" onClick={onCancel} className="hover:bg-gray-200 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  )
}

const PostingStatus = ({ job, applicationsCount }: PostingStatusProps) => {
  const {user} = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async() => {
    if(!user || !job?.id) return;
    const res = await DeleteJob(user.id, job.id);
    if(res.status === 200) {
      toast.info(`Job "${job.title}" deleted`);
      navigate("/employer-dashboard");
    }
  }
  return (
    <div className="flex flex-col gap-4 h-1/2 p-6 border border-gray-700 rounded-lg shadow-sm">
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

        { openDeleteModal &&
        <DeleteModal onDelete={handleDelete} onCancel={()=>setOpenDeleteModal(false)}/>
        }
        <div className="flex flex-col gap-3 mt-2">
          <Link
            to="edit"
            className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
          >
            <FaEdit className="text-sm" />
            <span>Edit Job Posting</span>
          </Link>
          <button
            onClick={()=>setOpenDeleteModal(true)}
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
