import React from 'react';
import Pagination from "../../shared/Pagination.tsx";
import useJobApplicationsResponseHeadersContext
  from "../../../hooks/jobapplications/useJobApplicationsResponseHeadersContext.ts";
import useJobApplicationParametersContext from "../../../hooks/jobapplications/useJobApplicationParametersContext.ts";

const ApplicationsPagination = () => {
  const { headers } = useJobApplicationsResponseHeadersContext();
  const { updateJobApplicationParameters } = useJobApplicationParametersContext();
  return (
    <Pagination headers={headers} updateParameters={updateJobApplicationParameters} />
  );
};

export default ApplicationsPagination;
