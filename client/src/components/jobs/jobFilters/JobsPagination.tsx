import React from 'react';
import { useJobResponseHeadersContext } from "../../../hooks/jobs/useJobResponseHeadersContext.ts";
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import Pagination from "../../Pagination.tsx";

const JobsPagination = () => {
    const { headers } = useJobResponseHeadersContext();
    const { updateJobParameters } = useJobParametersContext();
     console.log("HEADERS: ", headers)
    return (
          <Pagination headers={headers} updateParameters={updateJobParameters} />
    );
};

export default JobsPagination;