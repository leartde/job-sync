import React, { useEffect, useState } from 'react';
import { FaCheck, FaRegLightbulb, FaX } from 'react-icons/fa6';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import FetchJobSeekerSkills from "../../../services/skills/FetchJobSeekerSkills.ts";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";


type JobPreviewSkillsProps = {
    skills: string[];

}

const Skills = ({skills}: JobPreviewSkillsProps) => {
    const { user } = useAuth();
    const [userSkills, setUserSkills] = useState<string[]>();
    const [matchingSkills, setMatchingSkills] = useState<string[]>([]);
    const [unmatchingSkills, setUnMatchingSkills] = useState<string[]>([]);
    useEffect(() => {
        const fetchSkills = async()=>{
            const res = await FetchJobSeekerSkills(user?.id ?? "");
            setUserSkills(res.map((skill) => skill.name.split(' ').join('')));
        }
        fetchSkills().then();
    }, [user]);
    useEffect(() => {
        const matching = skills.filter(skill => userSkills?.map(s => s.toLowerCase()).includes(skill.toLowerCase()));
        const unmatching = skills.filter(skill => !userSkills?.map(s => s.toLowerCase()).includes(skill.toLowerCase()));
        setMatchingSkills(matching);
        setUnMatchingSkills(unmatching);
    }, [userSkills, skills]);
    return (
        <div className='flex flex-col p-6 border border-gray-300'>
            <h2 className='text-base font-medium'>Profile insights</h2>
            <div className="flex mt-3 gap-2 items-center">
            <FaRegLightbulb className='text-22xk' />
            <p className='font-medium '>Skills</p>
            </div>
            <div className="flex flex-col gap-2">
                {matchingSkills.length > 0 &&(matchingSkills.length == 1?<p>You have 1 matching skill</p>:<p>You have {matchingSkills.length} matching skills</p>) }
                <div className="flex flex-wrap gap-2 items-center">
                {matchingSkills?.map((skill)=>(
                    <div key={skill} className="flex p-2  items-center gap-2 font-semibold bg-green-100 border rounded-md border-green-200 text-green-900 text-sm">
                    <FaCheck/>
                    <span>{separateCamelCase(skill)}</span>
                    </div>

                    ))}
                {unmatchingSkills?.map((skill)=>(
                    <div key={skill} className="flex p-2  items-center gap-2 font-semibold bg-red-100 border rounded-md border-red-200 text-red-900 text-sm">
                    <span>{separateCamelCase(skill)}</span>
                    </div>

                ))}
                </div>
            </div>

        </div>
    );
}

export default Skills;
