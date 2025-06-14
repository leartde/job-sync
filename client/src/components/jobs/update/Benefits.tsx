import React, { useState } from 'react';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { FaTrash } from "react-icons/fa6";
import AddJobBenefit from "../../../services/job/AddJobBenefit.ts";
import DeleteJobBenefit from "../../../services/job/DeleteJobBenefit.ts";

type BenefitsProps = {
  employerId : string | undefined;
  jobId: string | undefined;
  benefits: string[] | undefined;
};

const Benefits = ({employerId, jobId,benefits}:BenefitsProps) => {
  const allBenefits = [
    "HealthInsurance",
    "PaidHoliday",
    "PaidTimeOff",
    "DentalInsurance"
  ]
  const [activeBenefits, setActiveBenefits] = useState(benefits || []);
  const [inactiveBenefits, setInactiveBenefits] = useState(allBenefits.filter(benefit => !benefits?.includes(benefit)));
  const [benefitToAdd, setBenefitToAdd] = useState<string>();
  const handleAdd = async(benefit: string) => {
  if (!employerId || !jobId) return;
    const res = await AddJobBenefit(employerId, jobId, benefit);
    if (res.status === 200){
      setActiveBenefits(prev => [...(prev || []), benefit]);
      setInactiveBenefits(prev => prev.filter(b => b !== benefit));
    }
  }

  const handleDelete = async(benefit: string) => {
    if (!employerId || !jobId) return;
    const res = await DeleteJobBenefit(employerId, jobId, benefit);
    if (res.status === 200) {
      setActiveBenefits(prev => prev?.filter(b => b !== benefit));
      setInactiveBenefits(prev => [...(prev || []), benefit]);
    }
  }
  return (
    <div className="text-white flex flex-col border-2 border-gray-400/20 shadow-md md:w-1/3 lg:w-1/4 p-4 rounded-md">
        <h2 className="text-white text-lg font-semibold mb-4">Current Benefits</h2>
        {activeBenefits?.map((benefit)=> (
          <div key={benefit} className="flex gap-2 justify-between">
            <p className="text-white font-medium text-lg">{separateCamelCase(benefit)}</p>
            <button
             onClick={() => handleDelete(benefit)}
              className="text-red-500 hover:text-red-700 transition-colors">
            <FaTrash/>
            </button>
          </div>
        ))}
        <div className="flex flex-col gap-2 mt-4">
          <select
            value={benefitToAdd || ""}
            onChange={(e) => setBenefitToAdd(e.target.value)}
            className="px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="" disabled>---</option>
            {inactiveBenefits.map((benefit) => (

              <option key={benefit} value={benefit}>
                {separateCamelCase(benefit)}
              </option>
            ))}
          </select>
          <button
            onClick={()=> handleAdd(benefitToAdd!)}
            disabled={!benefitToAdd}
            className={`${benefitToAdd?'bg-red-500 hover:bg-red-600':'bg-red-400'}  text-white px-2 py-1 rounded-md  transition-colors`}
          >
            Add Benefit
          </button>
        </div>
    </div>
  );
};

export default Benefits;
