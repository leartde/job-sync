import React from 'react';
import { useEmployerParametersContext } from "../../../hooks/employers/useEmployerParametersContext.ts";
import { useEmployerResponseHeadersContext } from "../../../hooks/employers/useEmployerResponseHeadersContext.ts";
import Pagination from "../../Pagination.tsx";

const EmployersPagination = () => {
    const { updateEmployerParameters } = useEmployerParametersContext();
    const { headers } = useEmployerResponseHeadersContext();
    return (
        <Pagination headers={headers} updateParameters={updateEmployerParameters}/>
    );
};

export default EmployersPagination;
