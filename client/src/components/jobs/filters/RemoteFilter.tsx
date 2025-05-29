import React, { useEffect, useState } from 'react';
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import { useSearchParams } from "react-router-dom";

const RemoteFilter = () => {
    const { jobParameters,updateJobParameters } = useJobParametersContext();
    const [, setSearchParams] = useSearchParams();
    const [isRemote, setIsRemote] = useState<boolean | null | undefined >();
    useEffect(() => {
        setIsRemote(jobParameters.IsRemote);
    }, [jobParameters.IsRemote]);
    const handleIsRemote = () => {
        setIsRemote(!isRemote);
        if(!isRemote){
            updateJobParameters({
                IsRemote: true,
                PageNumber : 1
            });
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('pageNumber','1');
                newParams.set('isRemote', 'true');
                return newParams;
            })

        }
        else{
            updateJobParameters({
                IsRemote: null,
                PageNumber : 1
            })
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('isRemote');
                return newParams;
            })}
    }
    return (
        <button
            onClick={handleIsRemote}
            className={` text-sm border rounded-xl ${isRemote ? 'text-[#e4e2e0] bg-gray-800' : 'bg-[#e4e2e0] text-gray-800'}  px-4 py-2`}>
            Remote
        </button>
    );
};

export default RemoteFilter;
