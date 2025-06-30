import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Job } from "../../types/job/Job.ts";
import fetchJob from "../../services/job/FetchJob.ts";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import Details from "../../components/jobs/update/Details.tsx";
import FetchJobAddress from "../../services/job/FetchJobAddress.ts";
import AddressForm from "../../components/jobs/update/AddressForm.tsx";
import { Address } from "../../types/address/Address.ts";
import Skills from "../../components/jobs/update/Skills.tsx";
import Benefits from "../../components/jobs/update/Benefits.tsx";

const UpdateJobForm = () => {
  const [job, setJob] = useState<Job>();
  const [activeSection, setActiveSection] = useState<'details' | 'address' | 'skills' | 'benefits'>('details');
  const { id } = useParams();
  const { user } = useAuth();
  const [address, setAddress] = useState<Address>();


  useEffect(() => {
    const getJob = async () => {
      if (user && id) {
        const data = await fetchJob(user.id, id);
        setJob(data);
      }
    }
    getJob().then();
  }, [id, user]);

  useEffect(() => {
    const getAddress = async()=>{
      if(job && user){
        const res = await FetchJobAddress(user.id, job.id);
        if (res.status === 200) setAddress(res.data)
      }
    }
    getAddress().then()
  }, [user, job]);
  return (
    <div className="flex flex-col gap-4 p-4 md:w-[90%] mx-auto md:flex-row">
      <div className="flex flex-col w-full p-4 gap-3 bg-gray-800/80 rounded-lg border border-gray-700 md:w-64">
        <div className="text-white text-xl font-semibold border-b border-gray-700 pb-3">
          Update Job Posting
        </div>

        <button
          type="button"
          onClick={() => setActiveSection('details')}
          className={`text-left p-3 rounded-md transition-all ${
            activeSection === 'details'
              ? 'bg-red-500 text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Details
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('address')}
          className={`text-left p-3 rounded-md transition-all ${
            activeSection === 'address'
              ? 'bg-red-500 text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Address
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('skills')}
          className={`text-left p-3 rounded-md transition-all ${
            activeSection === 'skills'
              ? 'bg-red-500 text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Skills
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('benefits')}
          className={`text-left p-3 rounded-md transition-all ${
            activeSection === 'benefits'
              ? 'bg-red-500 text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Benefits
        </button>
      </div>

      {activeSection === 'details' && <Details job={job}/>}
      {activeSection === 'address' && <AddressForm jobId={job?.id} employerId={user?.id} address={address}/>}
      {activeSection === 'skills' && <Skills jobId={job?.id} employerId={user?.id}  /> }
      {activeSection === 'benefits' && <Benefits jobId={job?.id} employerId={user?.id} benefits={job?.benefits}/> }
    </div>
  );
};

export default UpdateJobForm;
