import React from 'react';
import { industries } from "../../../utils/Industries.ts";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { useEmployerParametersContext } from "../../../hooks/employers/useEmployerParametersContext.ts";
import { useSearchParams } from "react-router-dom";

const IndustryFilter = () => {
    const { employerParameters, updateEmployerParameters } = useEmployerParametersContext();
    const [, setSearchParams] = useSearchParams();
    const [selectedIndustry, setSelectedIndustry] = React.useState<string | null | undefined>(null);
    React.useEffect(() => {
        setSelectedIndustry(employerParameters.Industry);
    }, [employerParameters.Industry]);
    const handleIndustryChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedIndustry(selectedValue);
        updateEmployerParameters({
            Industry: selectedValue,
            PageNumber: 1
        });
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (selectedValue) {
                newParams.set('pageNumber', '1');
                newParams.set('industry', selectedValue);
            } else {
                newParams.delete('industry');
            }
            return newParams;
        });
    };
    return (
        <div className="block max-md:ml-16 ml-60 mt-4">
            <select value={selectedIndustry ?? ""} onChange={handleIndustryChange} className="text-sm  border rounded-xl bg-[#e4e2e0] text-gray-800 px-4 py-2">
                <option value="">All industries</option>
                {industries.map((industry) => (
                    <option key={industry} value={industry}>
                        {separateCamelCase(industry)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default IndustryFilter;
