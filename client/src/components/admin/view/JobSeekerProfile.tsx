import React, { useState } from 'react';
import { JobSeeker } from "../../../types/jobseeker/JobSeeker.ts";
import { FaFemale, FaMailBulk, FaMale } from "react-icons/fa";
import { FaPhone, FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import DeleteUser from "../../../services/admin/DeleteUser.ts";
import { toast } from "react-toastify";
import DeleteModal from "../../shared/DeleteModal.tsx";
import InitialsProfile from "../../shared/InitialsProfile.tsx";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

const JobSeekerProfile = ({ jobSeeker } : {jobSeeker : JobSeeker}) => {
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const navigate = useNavigate();
const deleteUser = async(userId: string)=>{
  const res = await DeleteUser(userId);
  if(res.status === 200){
    toast.success("Job seeker profile deleted")
    navigate("/admin")
  }
}
  return (
    <div
      className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-gray-700/30 shadow-lg">
      {openDeleteModal && <DeleteModal onDelete={()=>deleteUser(jobSeeker.userId!)} onCancel={()=>setOpenDeleteModal(false)}
      title={"Delete profile"} paragraph={"Are you sure you want to delete this job seeker profile?"}
      />}
      <div className="flex flex-col gap-3 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0">
            <InitialsProfile name={`${jobSeeker?.firstName} ${jobSeeker?.middleName} ${jobSeeker?.lastName}`}/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{jobSeeker.firstName}
              {jobSeeker.middleName} {jobSeeker.lastName}
            </h2>
          </div>


        </div>
        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-2 text-gray-300 text-sm"><FaMailBulk/> {jobSeeker.email}</p>
          <p className="flex items-center gap-2 text-gray-300 text-sm"><FaPhone/> {jobSeeker.phone}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
        <div className="space-y-3">
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Address</span>
            <span className="text-gray-200">{jobSeeker.address || 'Not specified'}</span>
          </p>
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Birthday</span>
            <span
              className="text-gray-200">{new Date(jobSeeker.birthday ?? "").toLocaleDateString() || 'Not specified'}</span>
          </p>
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Resume</span>
            {jobSeeker.resumeLink ? <Link to={jobSeeker.resumeLink || '#'}
                                          className="text-gray-200">{jobSeeker.resumeName}</Link> : ' Not provided'}
          </p>
        </div>
      </div>
      <div
        className="flex flex-col gap-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20 md:col-span-2 lg:col-span-1">
        <div className="flex-1  ">
          <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
          <div className="text-sm flex-wrap text-gray-300 bg-gray-700/10 p-3 rounded-md h-40">
            {jobSeeker.skills?.map((skill)=>(
              <span key={skill} className="inline-block bg-gray-600/30 text-gray-200 px-2 py-1 m-1 rounded-md">{separateCamelCase(skill)}</span>
            ))
            }
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            type="button"
            onClick={() => setOpenDeleteModal(true)}
          >
            <FaTrash/>
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
