import { useContext } from "react";
import { JobApplicationParametersContext } from "../../context/jobapplications/JobApplicationParametersContext.tsx";

const useJobApplicationParametersContext = () => {
  return useContext(JobApplicationParametersContext);
}
export default useJobApplicationParametersContext;
