import React from 'react';
import useCreateJobContext from "../../../hooks/jobs/useCreateJobContext.ts";
import SkillsInput from "../../shared/SkillsInput.tsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import BenefitsInput from "./BenefitsInput.tsx";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import CreateJob from "../../../services/job/CreateJob.ts";
import { useNavigate } from "react-router-dom";

const SkillsAndBenefits = () => {
  const { jobData, updateJobData, formData, updateFormData } = useCreateJobContext();
const { user } = useAuth();
const navigate = useNavigate();
  const handleSkillsChange = (skills: string[]) => {
    updateJobData({ skills });
  };

  const handleBenefitsChange = (benefits: string[]) => {
    updateJobData({ benefits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(user){
      const result = await CreateJob(user.id,jobData);
      if(result.status === 200) {
        navigate("/employer-dashboard");
      } else {
        console.error("Error creating the job:", result);
      }
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-4/5">
      <legend className="text-xl font-semibold text-prettyGray">Skills and Benefits</legend>
      <SkillsInput
        onChange={handleSkillsChange}
        value={jobData.skills || []}
      />
      <BenefitsInput
        onChange={handleBenefitsChange}
        value={jobData.benefits || []}
      />
      <div className="flex justify-between mt-4">
        <button
          className="hover:bg-red-600 flex gap-1 items-center rounded-md text-lg font-medium bg-red-500 text-white py-1 px-2"
          type="button"
          onClick={() => updateFormData({ currentStep: formData.currentStep - 1 })}
        >
          <FaArrowLeft/> Previous
        </button>
        <button
          className="hover:bg-red-600 flex gap-1 items-center rounded-md text-lg font-medium bg-red-500 text-white py-1 px-2"
          type="submit"
        >
          Create <FaArrowRight/>
        </button>
      </div>
    </form>
  );
};

export default SkillsAndBenefits;
