import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import FetchEmployer from "../../services/employer/FechEmployer.ts";
import { Employer } from "../../types/employer/Employer.ts";
import { separateCamelCase } from "../../helpers/StringHelpers.ts";
import About from "../../components/employers/view/About.tsx";
import { Job } from "../../types/job/Job.ts";
import FetchJobsForEmployer from "../../services/job/FetchJobsForEmployer.ts";
import EmployerJobsSlider from "../../components/employers/view/EmployerJobsSlider.tsx";

const ViewEmployer = () => {
    const { id   } = useParams();
    const [employer, setEmployer] = useState<Employer>();
    const [jobs, setJobs] = useState<Job[]>();

    useEffect(() => {
        const getEmployer = async () => {
            const result = await FetchEmployer(id);
            if (result.status === 200)setEmployer(result.data);
            if (employer) {
                const res = await FetchJobsForEmployer(employer.id,{});
                setJobs(res.jobs);

            }
        }
        getEmployer().then()
    }, [employer, id]);
    return (
        <div className="sm:ml-36 md:ml-48 px-4 w-[90%] py-4">
            <div className=" flex max-md:w-2/3  md:w-[36%]   px-2 gap-4 border-2 border-red-500 rounded-lg py-4 items-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-gray-200">
                    <img src={employer?.photoUrl} alt="Employer Logo" className="w-full h-full rounded-md object-cover" />
                </div>
                <div>
                    <h1 className="text-xl text-white font-bold">{separateCamelCase(employer?.name)}</h1>
                    <p className="text-white text-xs">{employer?.email}</p>
                </div>
            </div>
            <About employer={employer}/>
            <div className="flex flex-col mt-16">
                 <h2 className=" text-white font-semibold text-3xl">Jobs</h2>
                <p className="text-white text-sm">Browse through all the jobs {employer?.name} has to offer</p>
            </div>
            <EmployerJobsSlider jobs={jobs} />
        </div>
    );
};

export default ViewEmployer;
