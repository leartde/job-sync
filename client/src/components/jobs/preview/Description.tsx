import React from 'react';

type JobPreviewDescriptionProps = {
    description? : string;
}
const Description = ({description}:JobPreviewDescriptionProps) => {
    return (
        <div className='flex flex-col gap-2 p-6 border border-gray-300'>
            <h2 className='text-base font-medium'>Full Description</h2>
          <div
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </div>
)
  ;
}

export default Description;
