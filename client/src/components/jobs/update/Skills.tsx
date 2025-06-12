import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaTrash } from "react-icons/fa6";
import { Skill } from "../../../types/skill/Skill.ts";
import FetchJobSkills from "../../../services/skills/FetchJobSkills.ts";
import CreateJobSeekerSkills from "../../../services/skills/CreateJobSeekerSkills.ts";
import CreateJobSkills from "../../../services/skills/CreateJobSkills.ts";
import DeleteJobSkills from "../../../services/skills/DeleteJobSkills.ts";

type SkillsProps = {
  employerId: string | undefined;
  jobId: string | undefined;
}
const Skills = ({employerId, jobId}:SkillsProps) => {
  const [skills,setSkills]=useState<Skill[]>([]);
  const [openSkillInput, setOpenSkillInput] = useState(false);
  const [skillToAdd, setSkillToAdd] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null );
  useEffect(() => {
    const getSkills = async ()=>{
      if(!employerId || !jobId) return;
      const res = await FetchJobSkills(employerId, jobId);
      setSkills(res);
    }
    getSkills().then()
  }, [employerId, jobId]);
  const handleAdd = async() => {
    if(!employerId || !jobId) return;

    const res =  await CreateJobSkills(employerId,jobId, [skillToAdd]);
    if(res.status === 200){
      setSkills([...skills, {id: res.data[0].id, name: skillToAdd}]);
      setOpenSkillInput(false);
      setSkillToAdd("");
    }
  }

  const handleDelete = async(id:string)=>{
    if(!employerId || !jobId) return;
    const res = await DeleteJobSkills(employerId, jobId, id);
    if(res.status === 200){
      setSkills(skills.filter(s => s.id !== id));
    }
    return;
  }
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAdd();
    }
  };
  return (
    <div className="flex flex-col max-h-80 overflow-auto md:w-[60%] lg:w-[40%] gap-2 p-4 border-2 border-gray-400/20 shadow-md">
      {skills?.map((skill) => (
        <div key={skill.name} className="flex items-center gap-4 justify-between p-2 border-b border-gray-300">
          <span className="text-gray-300">{skill.name}</span>
          <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700 focus:outline-none">
            <FaTrash/>
          </button>
        </div>
      ))}
      {skills?.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No skills added yet.
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-start">
          <button onClick={() => setOpenSkillInput(true)}
                  className="hover:bg-gray-900 bg-gray-800 text-white px-4 py-2 rounded-md">
            Add Skill
          </button>
        </div>
        {openSkillInput && <div className="flex gap-2 max-lg:flex-col">
          <input ref={inputRef} value={skillToAdd} onKeyDown={handleKeyDown} onChange={(e) => setSkillToAdd(e.target.value)}
                 className="px-2 py-1  bg-gray-700  rounded-md text-white" type="text"/>
          <button disabled={skillToAdd.trim()=="" || false} className="bg-gray-800 text-white px-4 py-2 rounded-md" onClick={() => handleAdd()}
                  type="button">Add
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => setOpenSkillInput(false)}
                  type="button">Cancel
          </button>

        </div>}
        </div>
    </div>
  );
};

export default Skills;
