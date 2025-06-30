import React from 'react';
import { Employer } from "../../types/employer/Employer.ts";
import { separateCamelCase } from "../../helpers/StringHelpers.ts";
import { Link } from "react-router-dom";
type EmployerCardParams = {
    employer: Employer;
}
const EmployerCard = ({employer}:EmployerCardParams) => {
    return (
        <div className="flex justify-between items-center  w-full gap-2 p-1 border-gray-600 border-b">
            <Link to={`${employer.id}`} className="flex items-center gap-4 p-1">
                <img className="h-16 w-16 rounded-lg" src="https://picsum.photos/200/300" alt=""/>
                <div className="flex flex-col">
                    <p className="text-red-500 font-semibold">{separateCamelCase(employer.name)}</p>
                    <p className="text-gray-400">{employer.headquarters}</p>
                </div>
            </Link>
            <a className="max-md:hidden text-white" href="">{separateCamelCase(employer.industry)}</a>

        </div>
    );
};

export default EmployerCard;
