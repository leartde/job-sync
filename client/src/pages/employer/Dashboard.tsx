import React, { useEffect, useState } from 'react';
import { Employer } from "../../types/employer/Employer.ts";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import FetchEmployer from "../../services/employer/FechEmployer.ts";
import { FaPlus, FaSuitcase } from "react-icons/fa6";
import { FaArchive } from "react-icons/fa";
import CompanyDetails from "../../components/employers/dashboard/CompanyDetails.tsx";
import JobPostings from "../../components/employers/dashboard/JobPostings.tsx";
import { JobParametersProvider } from "../../context/jobs/JobParametersContext.tsx";
import { JobResponseHeadersProvider } from "../../context/jobs/JobResponseHeadersContext.tsx";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";


const EmployerDashboardContent = () => {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<Employer>();
  const [activeTab, setActiveTab] = useState("details");
  useEffect(() => {
    const getEmployer = async () => {
      const res = await FetchEmployer(user?.id || "");
      if (res.status === 200) {
        setEmployer(res.data);
      }
    }
    getEmployer().then();
  }, [user]);
  return (
    <div className="w-[90%] md:w-9/12 mx-auto mt-8 p-4 flex flex-col md:flex-row md:gap-8 text-white">
      <div className="flex flex-col gap-2 md:w-1/4 lg:w-1/5">

        <Link
          to="create"
          className="flex items-center justify-center mb-4 gap-2 p-3 rounded-md bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium transition-all shadow-sm hover:shadow-md"
        >
          <FaPlus className="text-lg" />
          <span className="text-sm md:text-base">Add a new Job</span>
        </Link>
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
            activeTab === 'details'
              ? 'bg-red-500 shadow-lg'
              : 'bg-gray-800/50 hover:bg-gray-600'
          }`}
        >
          <FaSuitcase className="text-lg"/>
          <span className="text-sm md:text-base">Company Details</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
            activeTab === 'jobs'
              ? 'bg-red-500 shadow-lg'
              : 'bg-gray-800/50 hover:bg-gray-600'
          }`}
        >
          <FaArchive className="text-lg"/>
          <span className="text-sm md:text-base">Job Postings</span>
        </button>

      </div>

      <div className="flex-1 mt-4 md:mt-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "details" ? (
              <CompanyDetails employer={employer}/>
            ) : (
              <JobPostings employer={employer}/>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const Dashboard = () => {
  return (
    <JobParametersProvider>
      <JobResponseHeadersProvider>
        <EmployerDashboardContent />
      </JobResponseHeadersProvider>
    </JobParametersProvider>
  );
};

export default Dashboard;
