import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";

const JobTypeFilter = () => {
    const [jobType, setJobType] = useState<string | null | undefined>();
    const { jobParameters,updateJobParameters } = useJobParametersContext();
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        setJobType(jobParameters.JobType);
    }, [jobParameters.JobType]);
    const handleJobType = (e) => {
        setJobType(e.target.value);
        updateJobParameters({
            JobType: e.target.value,
            PageNumber : 1
        });
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if(e.target.value != null && e.target.value != ''){
                newParams.set('pageNumber','1');
                newParams.set('jobType', e.target.value);
            }
            else{
                newParams.delete('jobType');
            }
            return newParams;
        })
    };
    return (
        <select

            value={jobType ?? ""}
            onChange={handleJobType}
            className="text-sm  border rounded-xl bg-[#e4e2e0] text-gray-800 px-4 py-2" name="type"
            id="type">
            <option value="">All Types</option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
        </select>
    );
};

export default JobTypeFilter;
