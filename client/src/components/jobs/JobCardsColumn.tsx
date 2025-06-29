import JobCard from "./JobCard";
import { useSearchParams } from "react-router-dom";
import { Job } from "../../types/job/Job";

type JobCardsColumnProp = {
    jobs: Job[];
    updateMainJob: (job: Job) => void;
}

const JobCardsColumn = ({jobs, updateMainJob}: JobCardsColumnProp) => {
    const [, setSearchParams] = useSearchParams();
    
    const handleJobClick = (job: Job) => {
        updateMainJob(job);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('employerId', job.employerId);
            newParams.set('jobId', job.id);
            return newParams;
        });
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    return (
        <div className='max-h-[80vh] max-md:mt-16 overflow-scroll gap-4 p-2 max-md:w-full w-1/3 flex flex-col'>
            {jobs.map((job: Job) => (
                <JobCard
                    onClick={() => handleJobClick(job)} 
                    key={job.id}  
                    job={job}
                />
            ))}
        </div>
    );
}

export default JobCardsColumn;
