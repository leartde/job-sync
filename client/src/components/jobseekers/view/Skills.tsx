import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import FetchJobSeekerSkills from "../../../services/skills/FetchJobSeekerSkills.ts";
import { Skill } from "../../../types/skill/Skill.ts";
import { FaTrash } from "react-icons/fa6";
import DeleteJobSeekerSkill from "../../../services/skills/DeleteJobSeekerSkills.ts";
import CreateJobSeekerSkills from "../../../services/skills/CreateJobSeekerSkills.ts";


const Skills = () => {
    const { user } = useAuth();
     const [skills, setSkills] = useState<Skill[]>([]);
    const [openSkillInput, setOpenSkillInput]=  useState(false);
    const[skillToAdd, setSkillToAdd] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null );
    useEffect(() => {
        const fetchSkills = async()=>{
            const res = await FetchJobSeekerSkills(user?.id ?? "");
            setSkills(res);
        }
        fetchSkills().then();
    }, [user]);

    useEffect(() => {
        const inputEl = inputRef.current;
        if (inputEl) {
            inputEl.focus();
        }
    }, [openSkillInput]);

    const handleAdd = async() => {
       const res =  await CreateJobSeekerSkills(user?.id ?? "", [skillToAdd]);
        if(res.status === 200){
            setSkills([...skills, {id: res.data[0].id, name: skillToAdd}]);
            setOpenSkillInput(false);
            setSkillToAdd("");
        }
    }

    const handleDelete = async (skillId:string) => {
        await DeleteJobSeekerSkill(user?.id ?? "", skillId);
        setSkills(skills.filter(s => s.id != skillId));
    }
    return (
        <div className="flex flex-col md:w-1/2 w-full p-8 gap-4 border border-gray-600 rounded-lg shadow-sm">
            <h2 className="text-white text-3xl font-semibold">Skills</h2>

            <ul className="list-disc list-inside">
                {skills?.map((skill) => (
                    <li key={skill.id} className="flex justify-between text-white text-lg">
                        <span>{skill.name}</span>
                        <button onClick={() => handleDelete(skill.id)} className="hover:text-red-500">
                            <FaTrash/>
                        </button>
                    </li>
                ))}
            </ul>

            {
                (!openSkillInput && skills.length < 21) &&
                <div className="flex justify-start">
                    <button onClick={() => setOpenSkillInput(true)}
                            className="hover:bg-gray-900 bg-gray-800 text-white px-4 py-2 rounded-md">
                        Add Skill
                    </button>
                </div>
            }
            {openSkillInput && <div className="flex gap-2 max-lg:flex-col">
                <input ref={inputRef} value={skillToAdd} onChange={(e) => setSkillToAdd(e.target.value)}
                       className="px-2 py-1  bg-gray-700  rounded-md text-white" type="text"/>
                <button disabled={skillToAdd.trim()=="" || false} className="bg-gray-800 text-white px-4 py-2 rounded-md" onClick={() => handleAdd()}
                        type="button">Add
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => setOpenSkillInput(false)}
                        type="button">Cancel
                </button>

            </div>}
        </div>
    );
};

export default Skills;
