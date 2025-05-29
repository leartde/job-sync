import React from 'react';
import SearchBar from "../../SearchBar.tsx";
import { useEmployerParametersContext } from "../../../hooks/employers/useEmployerParametersContext.ts";

const Search = () => {
    const { updateEmployerParameters } = useEmployerParametersContext();


    return (
        <SearchBar placeholder={"Employer name"}    updateParameters={updateEmployerParameters}/>
    );
};

export default Search;

