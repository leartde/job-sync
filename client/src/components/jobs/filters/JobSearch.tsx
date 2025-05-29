import React from 'react';
import { useJobParametersContext } from "../../../hooks/jobs/useJobParametersContext.ts";
import SearchBar from "../../SearchBar.tsx";

const JobSearch = () => {
    const { updateJobParameters } = useJobParametersContext();

    return (
        <SearchBar placeholder={"Job title, company or address"} updateParameters={updateJobParameters}/>
    );
}

export default JobSearch;