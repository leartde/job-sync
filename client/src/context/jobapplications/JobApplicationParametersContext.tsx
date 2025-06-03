import { JobApplicationParameters } from "../../types/jobapplication/JobApplicationParameters.ts";
import { createContext, useState } from "react";

type JobApplicationParametersContextType = {
   jobApplicationParameters : JobApplicationParameters;
    updateJobApplicationParameters: (jobApplicationParameters: JobApplicationParameters) => void;
}

const defaultJobApplicationParameters: JobApplicationParameters = {
  PageSize: 4,
  PageNumber: 1,
}

export const JobApplicationParametersContext = createContext<JobApplicationParametersContextType>(
  {
    jobApplicationParameters: defaultJobApplicationParameters,
    updateJobApplicationParameters: () => {}
  }
);
export function JobApplicationParametersProvider({ children }: { children: React.ReactNode }) {
  const [jobApplicationParameters, setJobApplicationParameters] = useState<JobApplicationParameters>(defaultJobApplicationParameters);

    const updateJobApplicationParameters = (changes: Partial<JobApplicationParameters>) => {
        setJobApplicationParameters(prev => ({
            ...prev,
            ...changes
        }));
    };

    return (
        <JobApplicationParametersContext.Provider value={{ jobApplicationParameters, updateJobApplicationParameters }}>
            {children}
        </JobApplicationParametersContext.Provider>
    );
}
