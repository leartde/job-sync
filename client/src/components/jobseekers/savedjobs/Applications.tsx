import React, { useEffect, useState } from 'react';
import { JobApplication } from "../../../types/jobapplication/JobApplication.ts";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import FetchJobSeekerApplications from "../../../services/jobapplication/FetchJobSeekerApplications.ts";
import DeleteJobApplication from "../../../services/jobapplication/DeleteJobApplication.ts";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";



type DeleteModalProps = {
    onDelete: () => void;
    onCancel: () => void;
}
const DeleteModal = ({onDelete, onCancel}:DeleteModalProps)=>{
    return(
        <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold">Delete Job Application</h2>
                <p>Are you sure you want to delete this job application?</p>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                    <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                </div>
            </div>
        </div>
    )
}
const Applications = () => {
    const { user } = useAuth();
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            const res = await FetchJobSeekerApplications(user?.id ?? "");
            if (res.status === 200)setJobApplications(res.data);
        };
        fetchAppliedJobs().then();
    }, [user]);

    const DeleteApplication = async (jobSeekerId:string, jobId: string) => {
        const res = await DeleteJobApplication(jobSeekerId, jobId);
        if(res)setJobApplications(prev => prev.filter(app => app.jobId !== jobId));
        setOpenDeleteModal(false);
    }

    const JobStatusColors = {
        Submitted: "text-blue-500",
        Reviewed: "text-yellow-500",
        Interview: "text-green-300",
        Hired: "text-green-500",
        Rejected: "text-red-500",
    };



    return (
        <>
            {jobApplications.length > 0 ? (
                jobApplications.map((application) => (
                    <>
                        <div
                            key={application.jobId}
                            className="p-2  border rounded-md shadow-sm text-white "
                        >
                            <Link to={`/?jobId=${application.jobId}/employerId=${application.employerId}`} className="flex justify-between">
                                <p className="text-lg">{application.jobTitle}</p>
                                <p className="text-sm">{application.employer}</p>
                            </Link>
                            <div className="flex justify-between">
                                <p className={`${JobStatusColors[application.statusString]} font-semibold`}> {application.statusString}</p>
                                <button onClick={()=>setOpenDeleteModal(true)} className="text-red-500"> <FaTrash/> </button>
                            </div>
                        </div>
                        {openDeleteModal && <DeleteModal onCancel={()=>setOpenDeleteModal(false)} onDelete={()=>DeleteApplication(user?.id ?? "",application.jobId)}/>}
                    </>
                ))
            ) : (
                <p className="text-gray-500">No job applications found.</p>
            )}
        </>
    );
};

export default Applications;
