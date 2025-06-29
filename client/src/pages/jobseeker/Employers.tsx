import React, { useEffect, useState } from 'react';
import FetchAllEmployers from "../../services/employer/FetchAllEmployers.ts";
import { EmployerResponse } from "../../types/employer/EmployerResponse.ts";
import EmployerCardsColumn from "../../components/employers/EmployerCardsColumn.tsx";
import { Employer } from "../../types/employer/Employer.ts";
import Search from "../../components/employers/filters/Search.tsx";
import IndustryFilter from "../../components/employers/filters/IndustryFilter.tsx";
import { useSearchParams } from "react-router-dom";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import Pagination from "../../components/shared/Pagination.tsx";

const EmployersPage = () => {
    const [employers,setEmployers] = useState<Employer[]>([]);
    const [headers, setHeaders] = useState<ResponseHeaders>({
        HasNext: false,
        HasPrevious: false,
        PageSize: 10,
        TotalPages: 0,
        CurrentPage: 1,
        TotalCount: 0,
    });
    const [searchParams] = useSearchParams();
    const urlParams = {
        searchTerm: searchParams.get('searchTerm'),
        pageNumber: searchParams.get('pageNumber'),
        industry: searchParams.get('industry')

    }
       useEffect(() => {
           const params = {
             SearchTerm: urlParams.searchTerm || '',
             PageNumber: urlParams.pageNumber ? parseInt(urlParams.pageNumber) : 1,
             Industry: urlParams.industry || '',
           }
            const getData = async () => {
                try{
                    const data : EmployerResponse = await FetchAllEmployers(params);
                    if (data?.employers){
                        setEmployers(data.employers);
                        setHeaders(data.headers);
                    }
                }
                catch (e){
                    console.error("Error fetching employers: ", e);
                }

            }
            getData().then();
        }, [urlParams.pageNumber, urlParams.searchTerm, urlParams.industry]);

    return (
            <div className="flex flex-col">
              <div className="w-4/5 mx-auto">
              <Search/>
              </div>
                <IndustryFilter/>
                <EmployerCardsColumn employers={employers}/>
                <Pagination headers={headers}/>
            </div>
    );
};



export default EmployersPage;
