import React, { useState } from 'react';
import UsersDashboard from "../../components/admin/UsersDashboard.tsx";
import { useSearchParams } from "react-router-dom";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('role'));

  return (
    <div className="flex lg:flex-row flex-col w-[90%] gap-4 mx-auto p-4 text-white">
      <div className="flex flex-col gap-2 md:w-1/4 lg:w-1/5">
        <button
          onClick={() => {
            setActiveTab("");
            setSearchParams({})
          }}
          className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
            (activeTab === '' || activeTab == null)
              ? 'bg-red-500 shadow-lg'
              : 'bg-gray-800/50 hover:bg-gray-600'
          }`}>
          <span className="text-sm md:text-base">All Users</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("employer");
            setSearchParams({
              role: "employer"
            });
          }}
          className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
            activeTab === 'employer'
              ? 'bg-red-500 shadow-lg'
              : 'bg-gray-800/50 hover:bg-gray-600'
          }`}>
          <span className="text-sm md:text-base">Employers</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("jobseeker");
            setSearchParams({
              role: "jobseeker"
            })
          }}
          className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
            activeTab === 'jobseeker'
              ? 'bg-red-500 shadow-lg'
              : 'bg-gray-800/50 hover:bg-gray-600'
          }`}>
          <span className="text-sm md:text-base">JobSeekers</span>
        </button>
      </div>

      <UsersDashboard/>
    </div>
  );
};

export default AdminDashboard;
