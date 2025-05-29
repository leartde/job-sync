import React from 'react';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

type JobPreviewBenefitsProps = {
    benefits? : string[];
}
const Benefits = ({benefits}:JobPreviewBenefitsProps) => {
    return (
        <div className='flex flex-col gap-2 p-6 border border-gray-300'>
            <h2 className='text-base font-medium'>Benefits</h2>
            <ul className='list-disc px-4'>
                {
                    benefits?.map((benefit)=>(
                        <li key={benefit}> {separateCamelCase(benefit)}</li>
                    ))
                }
            </ul>
        </div>
    );
}

export default Benefits;