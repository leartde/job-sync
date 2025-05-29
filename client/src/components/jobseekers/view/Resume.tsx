import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import UpdateJobSeeker from "../../../services/jobseeker/UpdateJobSeeker.ts";
import { JobSeeker } from "../../../types/jobseeker/JobSeeker.ts";
import DeleteResume from "../../../services/jobseeker/DeleteResume.ts";

type ResumeProps = {
    profile: JobSeeker | undefined
}

type DeleteModalProps = {
    onDelete: () => void;
    onCancel: () => void;
}

const DeleteModal = ({onDelete, onCancel}:DeleteModalProps)=>{
    return(
        <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold">Delete Resume</h2>
                <p>Are you sure you want to delete your current resume</p>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onDelete} className="hover:bg-red-400 bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                    <button type="button" onClick={onCancel} className="hover:bg-gray-200 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                </div>
            </div>
        </div>
    )
}




const Resume = ({profile}:ResumeProps) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [fileToAdd, setFileToAdd] = useState<File | undefined>()
    const [updateResume, setUpdateResume] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterJobSeeker>({});
    const [resume, setResume] = useState({
        resumeLink: profile?.resumeLink,
        resumeName: profile?.resumeName
    });

    useEffect(() => {
        setResume({
           resumeLink: profile?.resumeLink,
            resumeName: profile?.resumeName

        })
    }, [profile?.resumeLink,profile?.resumeName]);
    useEffect(() => {
        setFormData({
           userId: profile?.userId,
            firstName: profile?.firstName,
            middleName: profile?.middleName,
            lastName: profile?.lastName,
            phone: profile?.phone,
            gender: profile?.gender,
            birthday: profile?.birthday

        })
    }, [profile]);
    const handleDelete = async() => {
       const result = await DeleteResume(profile?.id ?? "");
         if (result.status === 200){
              setResume({
                resumeLink: "",
                resumeName: ""
              })
         }
         setOpenDeleteModal(false);
    }
    const handleResumeChange = (e) => {
       setFileToAdd(e.target.files[0]);
     setFormData({
            ...formData,
            resume: e.target.files[0]

     })
    }
    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await UpdateJobSeeker(profile?.id ?? "", formData);
        if (result.status === 200){
            setResume(
                {
                    resumeLink: result.data.resumeLink,
                    resumeName: result.data.resumeName
                }
            )
        }
        setUpdateResume(false);
        setLoading(false);
    }
    return (
        <div className="flex flex-col w-full md:w-1/2 p-8 gap-4 border border-gray-600 rounded-lg shadow-sm">
            {openDeleteModal && <DeleteModal onDelete={handleDelete} onCancel={()=>setOpenDeleteModal(false)}/>}
            <h2 className="text-white text-3xl font-semibold">Resume</h2>
            {resume.resumeLink ? (
                    <div className="flex flex-col gap-2 sm:w-1/2 md:w-1/4"><p className="text-white text-lg">Download your resume here</p>
                        {!updateResume ? (
                            <div className="flex max-lg:flex-col gap-4">
                                <Link
                                    to={resume.resumeLink}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 ">{resume.resumeName?.slice(0, 10)}.{resume.resumeLink?.endsWith("x") ?resume.resumeLink?.slice(-4) : resume.resumeLink?.slice(-3)}</Link>
                                <button onClick={()=>setUpdateResume(true)} className="hover:bg-gray-800 bg-gray-700 px-4 py-1 rounded-md">Update</button>
                                <button onClick={() => setOpenDeleteModal(true)}
                                        className="hover:bg-gray-800 bg-gray-700 px-4 py-1 rounded-md">Delete
                                </button>
                            </div>): (<div className="flex">
                            <form onSubmit={handleUpload} method="POST" encType="multipart/form-data"
                                  className="flex flex-col gap-2">
                                <input onChange={handleResumeChange} type="file" accept=".pdf,.doc,.docx"
                                       className="bg-gray-600 text-white px-4 py-2 rounded-md"/>
                                <div className="flex gap-4">
                                    <button disabled={fileToAdd == undefined || false} type="submit"
                                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Upload
                                    </button>
                                    <button onClick={() => setUpdateResume(false)}
                                            className="hover:bg-gray-800 bg-gray-700 px-4 py-1 rounded-md">Cancel
                                    </button>
                                </div>
                            </form>
                        </div>)
                        }
                    </div>) :
                (
                    <div className="flex flex-col gap-2 sm:w-1/2 md:w-1/4">
                        <p className="text-white text-lg">You have not uploaded a resume yet</p>
                        <form onSubmit={handleUpload} method="POST" encType="multipart/form-data"
                              className="flex flex-col gap-2">
                            <input onChange={handleResumeChange} type="file" accept=".pdf,.doc,.docx" className="bg-gray-600 text-white px-4 py-2 rounded-md"/>
                            <button disabled={fileToAdd == undefined || false} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Upload</button>
                        </form>
                    </div>)
            }
            {loading && (
                <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="mt-4">Uploading your resume...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resume;
