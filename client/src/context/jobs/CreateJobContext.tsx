import { AddJob } from "../../types/job/AddJob.ts";
import { createContext, useState } from "react";

type CreateJobContextType = {
   jobData : AddJob;
   updateJobData: (changes: Partial<AddJob>) => void;
   formData: {
     currentStep: number;
      steps: number;
   }
   updateFormData: (changes: Partial<{ currentStep: number; steps: number }>) => void;
}

export const CreateJobContext = createContext<CreateJobContextType |undefined>(undefined);

export function CreateJobProvider({ children }: { children }) {
    const [jobData, setJobData] = useState<AddJob>({});
    const [formData, setFormData] = useState<{ currentStep: number; steps: number }>({
        currentStep: 1,
        steps: 4
    });

    const updateJobData = (changes: Partial<AddJob>) => {
      setJobData(prev => ({
            ...prev,
            ...changes
        }));
    };
    const updateFormData = (changes: Partial<{ currentStep: number; steps: number }>) => {
        setFormData(prev => ({
            ...prev,
            ...changes
        }));
    };

    return (
        <CreateJobContext.Provider value={{ jobData, updateJobData, formData, updateFormData }}>
            {children}
        </CreateJobContext.Provider>
    );
}
