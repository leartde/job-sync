import React, { useState } from 'react';
import { Employer } from "../../../types/employer/Employer.ts";
import { FaPhone, FaTrash } from "react-icons/fa6";
import { FaMailBulk } from "react-icons/fa";
import DeleteUser from "../../../services/admin/DeleteUser.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../shared/DeleteModal.tsx";


const EmployerProfile = ({ employer } : { employer: Employer }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const deleteUser = async(userId: string)=>{
    const res = await DeleteUser(userId);
    if(res.status === 200){
      toast.success("Employer deleted")
      navigate("/admin")
    }
  }
  console.log(employer);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-gray-700/30 shadow-lg">
      {openDeleteModal && <DeleteModal onDelete={()=>deleteUser(employer.userId!)} onCancel={
        ()=>setOpenDeleteModal(false)}
        title="Delete profile"
        paragraph="Are you sure you want to delete this employer profile?"
      />}
      <div className="flex flex-col gap-3 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0">
            <img
              className="w-full h-full rounded-xl object-cover border border-gray-600/30"
              alt="logo"
              src={employer.photoUrl || '/default-company.png'}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{employer.name}</h2>
            <p className="text-sm font-semibold text-blue-300">{employer.industry}</p>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-sm flex items-center gap-2 text-gray-300">
           <FaMailBulk/>
            {employer.email}
          </p>
          <p className="text-sm flex items-center gap-2 text-gray-300">
            <FaPhone/>
            {employer.phone || 'Not provided'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
        <h3 className="text-lg font-semibold text-white mb-1">Company Details</h3>
        <div className="space-y-3">
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Headquarters</span>
            <span className="text-gray-200">{employer.headquarters || 'Not specified'}</span>
          </p>
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Website</span>
            <a href={employer.website} target="_blank" rel="noopener noreferrer"
               className="text-blue-400 hover:underline">
              {employer.website || 'No website'}
            </a>
          </p>
          <p className="text-sm">
            <span className="block text-xs text-gray-400">Founded</span>
            <span className="text-gray-200">{employer.founded || 'Unknown'}</span>
          </p>
        </div>
      </div>

      <div
        className="flex flex-col gap-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/20 md:col-span-2 lg:col-span-1">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">About</h3>
          <div className="text-sm text-gray-300 bg-gray-700/10 p-3 rounded-md h-40 overflow-y-auto">
            {employer.description || 'No description available.'}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            type="button"
            onClick={()=>setOpenDeleteModal(true)}
          >
            <FaTrash/>
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
