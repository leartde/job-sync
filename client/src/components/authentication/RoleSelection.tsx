import React from 'react';
import {FaBriefcase, FaPerson} from "react-icons/fa6";
import { useRegisterFormContext } from "../../hooks/authentication/useRegisterFormContext.ts";

const RoleSelection = () => {
    const { updateRegisterForm } = useRegisterFormContext();
    const [type, setType] = React.useState<"jobseeker" | "employer" >();
    const handleTypeSubmit = (type: "jobseeker" | "employer" | undefined) => {
        updateRegisterForm({
            type: type,
            steps: type=="jobseeker"?4:3,
            currentStep: 1,
        });
    };
    return (
        <div className='mx-auto w-3/4 md:w-1/3 xl:w-1/4 rounded-md mt-16 flex flex-col items-center bg-white py-12 px-6'>
            <h1 className='text-2xl font-bold text-black'>Register</h1>

            <div className='flex flex-col gap-4 mt-4'>
                <div onClick={() => setType('jobseeker')}
                     className={`cursor-pointer flex items-center gap-2 border border-gray-400 p-2 rounded-md ${type === 'jobseeker' ? 'border-red-500 border-2' : ''}`}>
                    <div className={`p-1 border-r border-gray-200`}>
                        <FaPerson className='text-2xl text-red-500'/>
                    </div>
                    <h1>I am a job seeker looking for a job</h1>
                </div>
                <div onClick={() => setType('employer')}
                     className={`cursor-pointer flex items-center gap-2 border border-gray-400 p-2 rounded-md ${type === 'employer' ? 'border-red-500 border-2' : ''}`}>
                    <div className='p-1 border-r border-gray-200'>
                        <FaBriefcase className='text-2xl text-red-500'/>
                    </div>
                    <h1>I am an employer looking to hire</h1>
                </div>


                <button onClick={()=>handleTypeSubmit(type)}
                disabled={type === undefined}
                        className='disabled:bg-red-300 text-white h-12  text-center font-medium  bg-red-500  px-4 rounded-lg'>
                    Continue
                </button>

            </div>

        </div>
    );
};

export default RoleSelection;
