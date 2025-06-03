import React, { useState } from 'react';
import { CreateJobProvider } from "../../context/jobs/CreateJobContext.tsx";
import useCreateJobContext from "../../hooks/jobs/useCreateJobContext.ts";
import BasicInformation from "../../components/jobs/create/BasicInformation.tsx";
import Description from "../../components/jobs/create/Description.tsx";
import SkillsAndBenefits from "../../components/jobs/create/SkillsAndBenefits.tsx";


const CreateJobContent = () =>{
  const { jobData, updateJobData, formData, updateFormData } = useCreateJobContext();

  return(
    <div className="flex flex-col md:w-3/4 text-white mx-auto items-center mt-2 border-b pb-2 border-gray-600 shadow-sm rounded-sm">
      {formData.currentStep === 1 && <BasicInformation/>}
      {formData.currentStep === 2 && <Description/>}
      {formData.currentStep === 3 && <SkillsAndBenefits/>}
    </div>
  )
}
const AddJob = () => {
  return (
    <CreateJobProvider>
      <CreateJobContent />
    </CreateJobProvider>
  );
};

export default AddJob;
