import React, { useEffect, useState } from 'react';
import FetchAllEmployers from "../../services/employer/FetchAllEmployers.ts";
import { EmployerResponse } from "../../types/employer/EmployerResponse.ts";
import EmployerCardsColumn from "../../components/employers/EmployerCardsColumn.tsx";
import { Employer } from "../../types/employer/Employer.ts";
import { EmployerParametersProvider } from "../../context/employers/EmployerParametersContext.tsx";
import { useEmployerParametersContext } from "../../hooks/employers/useEmployerParametersContext.ts";
import Search from "../../components/employers/filters/Search.tsx";
import { useEmployerResponseHeadersContext } from "../../hooks/employers/useEmployerResponseHeadersContext.ts";
import { EmployerResponseHeadersProvider } from "../../context/employers/EmployerResponseHeadersContext.tsx";
import EmployersPagination from "../../components/employers/filters/EmployersPagination.tsx";
import IndustryFilter from "../../components/employers/filters/IndustryFilter.tsx";
import { useSearchParams } from "react-router-dom";

const EmployersPageContent = () => {
    const [employers,setEmployers] = useState<Employer[]>([]);
    const { employerParameters } = useEmployerParametersContext();
    const { updateHeaders } = useEmployerResponseHeadersContext();
    const [searchParams] = useSearchParams();
    const urlParams = {
        searchTerm: searchParams.get('searchTerm'),
        pageNumber: searchParams.get('pageNumber'),
        industry: searchParams.get('industry')

    }
       useEffect(() => {
           if(urlParams.searchTerm){
                employerParameters.SearchTerm = urlParams.searchTerm;
           }
              if(urlParams.pageNumber) {
                  employerParameters.PageNumber = parseInt(urlParams.pageNumber);
              }
              if(urlParams.industry) {
                  employerParameters.Industry = urlParams.industry;
              }

            const getData = async () => {
                try{
                    const data : EmployerResponse = await FetchAllEmployers(employerParameters);
                    if (data?.employers){
                        setEmployers(data.employers);
                        updateHeaders(data.headers);
                    }
                }
                catch (e){
                    console.error("Error fetching employers: ", e);
                }

            }
            getData().then();
        }, [employerParameters.PageNumber,employerParameters.PageSize, employerParameters.SearchTerm, employerParameters.Industry, urlParams.pageNumber, urlParams.searchTerm, urlParams.industry]);

    return (
            <div className="flex flex-col">
              <div className="w-4/5 mx-auto">
              <Search/>
              </div>
                <IndustryFilter/>
                <EmployerCardsColumn employers={employers}/>
                <EmployersPagination/>
            </div>
    );
};

const EmployersPage = () => {
    return (
        <EmployerParametersProvider>
            <EmployerResponseHeadersProvider>
                <EmployersPageContent/>
            </EmployerResponseHeadersProvider>
        </EmployerParametersProvider>
    )
}

export default EmployersPage;
