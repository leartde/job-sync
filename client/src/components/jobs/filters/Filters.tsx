import React from 'react';
import RemoteFilter from "./RemoteFilter.tsx";
import MultipleSpotsFilter from "./MultipleSpotsFilter.tsx";
import JobTypeFilter from "./JobTypeFilter.tsx";
import MinimumPayFilter from "./MinimumPayFilter.tsx";

const Filters = () => {

    return (
        <div className="max-md:flex-col max-md:items-center flex justify-center gap-4 py-2 ">
            <div className="flex gap-4">
                <RemoteFilter/>
                <MultipleSpotsFilter/>
            </div>
            <div className="flex gap-4">
                <JobTypeFilter/>
                <MinimumPayFilter/>
            </div>
        </div>
    );
};

export default Filters;
