import React, { useEffect, useState } from 'react';
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import FetchJobSeeker from "../../services/jobseeker/FetchJobSeeker.ts";
import { JobSeeker } from "../../types/jobseeker/JobSeeker.ts";
import ContactDetails from "../../components/jobseekers/view/ContactDetails.tsx";
import ResumeLink from "../../components/jobseekers/view/Resume.tsx";
import Skills from "../../components/jobseekers/view/Skills.tsx";

const View = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<JobSeeker>();
    useEffect(() => {
        const fetchJobSeekerData = async () => {
            const res = await FetchJobSeeker(user?.id ?? "");
            if(res.status === 200)setProfile(res.data);
        }
        fetchJobSeekerData().then()
    }, [user]);
    return (
        <div className="text-white px-4 mt-8 w-full flex flex-col items-center justify-center gap-8 py-4">
            <ContactDetails profile={profile} user={user}/>
            <ResumeLink profile={profile} />

            <Skills />
        </div>

    );
};

export default View;
