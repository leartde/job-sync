import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { User } from "../../types/authentication/User.ts";
import FetchUser from "../../services/admin/FetchUser.ts";
import { Employer } from "../../types/employer/Employer.ts";
import { JobSeeker } from "../../types/jobseeker/JobSeeker.ts";
import FetchEmployerByUserId from "../../services/employer/FetchEmployerByUserId.ts";
import FetchJobSeekerByUserId from "../../services/jobseeker/FetchJobSeekerByUserId.ts";
import EmployerProfile from "../../components/admin/view/EmployerProfile.tsx";
import JobSeekerProfile from "../../components/admin/view/JobSeekerProfile.tsx";

const ViewUser = () => {
  const { id } = useParams();
 const [user, setUser] = useState<User>();
 const [employer, setEmployer] = useState<Employer| null>(null);
 const [jobSeeker, setJobSeeker] = useState<JobSeeker | null>(null);
  useEffect(() => {
    if(!id)return;
    const getUser = async ()=>{
      const res = await FetchUser(id);
      if(res.status === 200) setUser(res.data);
    }
    getUser().then()
  }, [id]);

  const getEmployerByUserId = async(userId: string)=>{
    const res = await FetchEmployerByUserId(userId);
    if(res.status === 200)setEmployer(res.data);
  }

  const getJobSeekerByUserId = async (userId: string) => {
    const res = await FetchJobSeekerByUserId(userId);
    if(res.status === 200) setJobSeeker(res.data);
  }
  useEffect(() => {
    if(user == null)return;
        if(user.role === "Employer" && user.id){
          getEmployerByUserId(user.id).then();
        }
        else if(user.role === "JobSeeker" && user.id){
          getJobSeekerByUserId(user.id).then();
        }
  },[user]);
  return (
    <div className="w-[90%] text-prettyGray rounded-sm mt-4 bg-gray-800/40 shadow-sm flex mx-auto">
      {employer && <EmployerProfile employer={employer}/>}
      {jobSeeker && <JobSeekerProfile jobSeeker={jobSeeker}/>}
    </div>
  );
};

export default ViewUser;
