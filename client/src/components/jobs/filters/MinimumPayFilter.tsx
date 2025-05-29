import React, { useEffect, useState } from 'react';
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import { useSearchParams } from "react-router-dom";

const MinimumPayFilter = () => {
    const { jobParameters,updateJobParameters } = useJobParametersContext();
    const [, setSearchParams] = useSearchParams();
    const [minimumPay, setMinimumPay] = useState<number | null | undefined>();

    useEffect(() => {
        setMinimumPay(jobParameters.MinimumPay);
    }, [jobParameters.MinimumPay]);
    const handleMinimumPay = (e) => {
        setMinimumPay(parseFloat(e.target.value));
        updateJobParameters({
            MinimumPay: parseFloat(e.target.value),
            PageNumber : 1
        });
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if(e.target.value != null && e.target.value != ''){
                newParams.set('pageNumber','1');
                newParams.set('minimumPay', e.target.value);
            }
            else{
                newParams.delete('minimumPay');
            }
            return newParams;
        })
    }
    return (
        <select
            value={minimumPay ?? ""}
            onChange={handleMinimumPay}
            className="text-sm border rounded-xl bg-[#e4e2e0] text-gray-800 px-4 py-2" name="pay"
            id="pay">
            <option value="">No minimum pay</option>
            <option value="15">$15+/hour</option>
            <option value="17.5">$17.5+/hour</option>
            <option value="20">$20+/hour</option>
            <option value="25">$25+/hour</option>
            <option value="30">$30+/hour</option>
        </select>
    );
};

export default MinimumPayFilter;
