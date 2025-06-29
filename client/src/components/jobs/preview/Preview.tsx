import StickyPreview from './StickyPreview';
import Skills from './Skills.tsx';
import Location from './Location.tsx';
import Details from './Details.tsx';
import Benefits from './Benefits.tsx';
import Description from './Description.tsx';

import { Job } from "../../../types/job/Job.ts";

const Preview = ({mainJob}:{mainJob:Job | null}) => {
    return (
        <div id="preview" className='flex w-1/2 max-h-[600px]  bg-gray-50 flex-col max-md:w-full  rounded-md  overflow-scroll'>

            <StickyPreview id={mainJob?.id} image={mainJob?.imageUrl} title={mainJob?.title} type={mainJob?.type} employer={mainJob?.employer} address={mainJob?.address} pay={mainJob?.pay}/>

            <Skills skills={mainJob?.skills || []}/>

            <Details pay={mainJob?.pay} jobType={mainJob?.type} hasMultipleSpots = {mainJob?.hasMultipleSpots} />

            <Location address={mainJob?.address}/>

            <Benefits benefits={mainJob?.benefits}/>

            <Description description={mainJob?.description}/>

        </div>
    );
}
export default Preview;
