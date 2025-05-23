import { FaAlignJustify } from "react-icons/fa6";
import { Job } from "../../types/job/Job.ts";

type JobCardParams = {
    job: Job;
    onClick: () => void;
}

const JobCard = ({job, onClick}: JobCardParams) => {
    return (
        <div onClick={onClick} className="flex flex-col bg-white px-12 py-6 border border-gray-800 rounded-md">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">{job.title}</h1>
                <FaAlignJustify className="cursor-pointer" />
            </div>
            <div className="text-sm mt-1">
                <p>{job.employer}</p>
                <p>{job.address}</p>
            </div>
            <div className="text-xs text-gray-600">
                {job.description}
            </div>
            <div className="border-t border-gray-800 mt-4 relative top-2 pt-4     ">
                <a href="">
                    <p className="text-sm text-blue-500 underline">View similar jobs with this employer</p>
                </a>

            </div>
        </div>
    );
}

export default JobCard;
