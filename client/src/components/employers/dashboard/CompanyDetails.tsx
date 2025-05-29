import React from 'react';
import { Employer } from "../../../types/employer/Employer.ts";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

type CompanyDetailsProps = {
    employer: Employer | undefined;
}
const CompanyDetails = ({employer}:CompanyDetailsProps) => {
    return (
        <div className="flex flex-col p-4 gap-4 w-full">
            <div className="flex gap-8 items-center">
                <img src={employer?.photoUrl} alt="Employer Logo"
                     className="w-16 h-16 object-cover rounded-md"/>
                <h1 className="text-2xl font-bold">{employer?.name}</h1>
            </div>
            <p className="text-sm">Industry: {separateCamelCase(employer?.industry)}</p>                        <p
            className="text-sm">Email: {employer?.email}</p>
            <p className="text-sm">Phone: {employer?.phone}</p>
            <p className="text-sm">Headquarters: {employer?.headquarters}</p>
            <p className="text-sm">Website: {employer?.website}</p>
            <p className="text-sm">Founded: {employer?.founded}</p>
            <p className="text-sm">{employer?.description}</p>
            <div>
                <button type="button" className="hover:bg-red-400 rounded-md bg-red-500 text-white px-1 py-2 ">
                    Edit Company Details
                </button>
            </div>

        </div>
    );
};

export default CompanyDetails;
