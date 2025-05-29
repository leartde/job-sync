import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { PiMoneyLight } from 'react-icons/pi';
import { RiSuitcaseLine } from 'react-icons/ri';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

type JobPreviewDetailsProps = {
    pay?: string;
    jobType?: string;
    hasMultipleSpots?: boolean;
}
const Details = ({pay, jobType,hasMultipleSpots}:JobPreviewDetailsProps) => {
    return (
        <div className='flex flex-col p-6 border border-gray-300'>
        <h2 className='text-base font-medium'>Job Details</h2>
        <p className='text-xs text-gray-600'> Here's the job details that align with your profile. </p>
        <div className="flex mt-3 gap-2 items-center">
        <PiMoneyLight className='text-2xl' />
        <p className='font-medium '>Pay</p>
        </div>
        <div className="flex gap-2 ">
            <div className="flex p-2 items-center gap-2 font-semibold bg-green-100 border rounded-md border-green-200 text-green-900 text-sm">
                
           <FaCheck/>
           <span>{pay}</span>
            </div>

        </div>

        <div className="flex mt-3 gap-2 items-center">
        <RiSuitcaseLine className='text-2xl' />
        <p className='font-medium '>Job Type</p>
        </div>
            <div className="flex gap-2 ">
                <div
                    className="flex p-2 items-center gap-2 font-semibold bg-green-100 border rounded-md border-green-200 text-green-900 text-sm">

                    <FaCheck/>
                    <span>{separateCamelCase(jobType)}</span>
                </div>
            </div>

            <div className='flex flex-col mt-4'>
                <p className='font-semibold text-md'>Encouraged to apply</p>
                <ul>
                    <li>16+ years old</li>
                    <li>16+ years old</li>
                </ul>

            </div>

            {
                hasMultipleSpots &&
                <div className='flex flex-col mt-4'>
                    <p className='font-medium text-md'>This job is hiring multiple applicants!</p>
                </div>
            }

    </div>
    );
}

export default Details;
