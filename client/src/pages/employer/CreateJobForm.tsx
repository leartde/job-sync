import React, { useState, useEffect } from 'react';
import { CreateJobProvider } from "../../context/jobs/CreateJobContext.tsx";
import useCreateJobContext from "../../hooks/jobs/useCreateJobContext.ts";
import BasicInformation from "../../components/jobs/create/BasicInformation.tsx";
import Description from "../../components/jobs/create/Description.tsx";
import SkillsAndBenefits from "../../components/jobs/create/SkillsAndBenefits.tsx";
import { AnimatePresence, motion } from "framer-motion";

const CreateJobContent = () => {
  const { formData } = useCreateJobContext();
  const [stepHistory, setStepHistory] = useState<number[]>([formData.currentStep]);

  useEffect(() => {
    setStepHistory(prev => [...prev, formData.currentStep]);
  }, [formData.currentStep]);

  const getDirection = () => {
    if (stepHistory.length < 2) return 1;
    const prevStep = stepHistory[stepHistory.length - 2];
    return prevStep < formData.currentStep ? 1 : -1;
  };

  return (
    <div className="flex flex-col md:w-3/4 text-white mx-auto items-center mt-2 border-b pb-2 border-gray-600 shadow-sm rounded-sm">
      <AnimatePresence mode="wait" custom={getDirection()}>
        <motion.div
          key={formData.currentStep}
          custom={getDirection()}
          initial={{ opacity: 0, x: getDirection() * 100 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          }}
          exit={{
            opacity: 0,
            x: getDirection() * -100,
            transition: { duration: 0.2 }
          }}
          className="flex flex-col gap-4 w-full"
        >
          {formData.currentStep === 1 && <BasicInformation />}
          {formData.currentStep === 2 && <Description />}
          {formData.currentStep === 3 && <SkillsAndBenefits />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CreateJobForm = () => {
  return (
    <CreateJobProvider>
      <CreateJobContent />
    </CreateJobProvider>
  );
};

export default CreateJobForm;
