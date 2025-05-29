import React, { useEffect, useState } from 'react';
import UpdatePersonalDetails from "../../components/jobseekers/update/UpdatePersonalDetails.tsx";
import FetchJobSeeker from "../../services/jobseeker/FetchJobSeeker.ts";
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import { JobSeeker } from "../../types/jobseeker/JobSeeker.ts";
import UpdateAddress from "../../components/jobseekers/update/UpdateAddress.tsx";

const Update = () => {
    const { user } = useAuth();
    const [profile, setProfile] =useState<JobSeeker>();
    const [activeTab, setActiveTab] = useState("personalDetails");
    useEffect(() => {
        const fetchJobSeekerData = async () => {
            const res = await FetchJobSeeker(user?.id ?? "");
            if (res.status === 200) setProfile(res.data);
        }
        fetchJobSeekerData().then()
    }, [user]);
    return (
        <div className="text-white px-4 mt-8 mx-auto flex flex-col md:flex-row w-full md:w-2/3 gap-8 py-4">

            <div className=" md:flex hidden h-1/4 items-center flex-col gap-4 p-4 border border-gray-600 rounded-lg shadow-sm">
                <div
                    className={`${activeTab === "personalDetails" ? 'border-b-2 font-semibold border-red-500' : ''} py-2`}>
                    <button onClick={() => setActiveTab("personalDetails")} type="button">Personal Details</button>
                </div>
                <div className={`${activeTab === "address" ? 'border-b-2 font-semibold border-red-500' : ''} py-2`}>
                    <button onClick={() => setActiveTab("address")}>Address</button>
                </div>
            </div>

            <div className=" md:hidden w-full ">
                 <select onChange={(e)=>setActiveTab(e.target.value)} className="bg-gray-800 p-2 rounded-md w-full">
                    <option value="personalDetails">Personal Details</option>
                    <option value="address">Address</option>
                 </select>
            </div>
            {activeTab === "personalDetails" ? <UpdatePersonalDetails user={user} profile={profile}/> :
                <UpdateAddress user={user}/>
            }

        </div>
    );
};

export default Update;
