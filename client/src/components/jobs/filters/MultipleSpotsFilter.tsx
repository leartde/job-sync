import React, { useEffect, useState } from 'react';
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import { useSearchParams } from "react-router-dom";

const MultipleSpotsFilter = () => {
    const { jobParameters,updateJobParameters } = useJobParametersContext();
    const [, setSearchParams] = useSearchParams();
    const [hasMultipleSpots,setHasMultipleSpots] = useState<boolean | null | undefined>();
    useEffect(() => {
        setHasMultipleSpots(jobParameters.HasMultipleSpots);
    }, [jobParameters.HasMultipleSpots]);
    const handleHasMultipleSpots = () => {
        setHasMultipleSpots(!hasMultipleSpots);
        if (!hasMultipleSpots) {
            updateJobParameters({
                HasMultipleSpots: true,
                PageNumber : 1
            });
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('pageNumber','1');
                newParams.set('hasMultipleSpots', 'true');
                return newParams;
            })

        } else {
            updateJobParameters({
                HasMultipleSpots: null,
                PageNumber : 1
            })
            setSearchParams(prev =>{
                const newParams = new URLSearchParams(prev);
                newParams.delete('hasMultipleSpots');
                return newParams;
            })
        }
    }
    return (
        <button
            onClick={handleHasMultipleSpots}
            className={` text-sm border rounded-xl ${hasMultipleSpots ? 'text-[#e4e2e0] bg-gray-800' : 'bg-[#e4e2e0] text-gray-800'}  px-4 py-2`}>
            Has Multiple Spots
        </button>
    );
};

export default MultipleSpotsFilter;
