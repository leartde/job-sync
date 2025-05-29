import React from 'react';

type JobPreviewDescriptionProps = {
    description? : string;
}
const Description = ({description}:JobPreviewDescriptionProps) => {
    return (
        <div className='flex flex-col gap-2 p-6 border border-gray-300'>
            <h2 className='text-base font-medium'>Full Description</h2>
            <p className='text-sm text-gray-600'> {description} </p>
        </div>
    );
}

export default Description;