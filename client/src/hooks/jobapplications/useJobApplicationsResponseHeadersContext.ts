import { useContext } from "react";
import {
  JobApplicationResponseHeadersContext
} from "../../context/jobapplications/JobApplicationResponseHeadersContext.tsx";

const useJobApplicationsResponseHeadersContext = () => {
  return useContext(JobApplicationResponseHeadersContext);
}

export default useJobApplicationsResponseHeadersContext;
