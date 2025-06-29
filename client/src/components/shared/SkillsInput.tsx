import React, { useState, KeyboardEvent } from 'react';

type SkillsInputProps = {
  value: string[];
  onChange?: (skills: string[]) => void;
};

const SkillsInput = ({value = [], onChange }: SkillsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [localSkills, setLocalSkills] = useState<string[]>(value);

  const handleAddSkill = () => {
    if (inputValue.trim() && !localSkills.includes(inputValue.trim())) {
      const newSkills = [...localSkills, inputValue.trim()];
      setLocalSkills(newSkills);
      onChange?.(newSkills);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSkillClick = (index: number) => {
    const newSkills = localSkills.filter((_, i) => i !== index);
    setLocalSkills(newSkills);
    onChange?.(newSkills);
  };

  const handleClearAll = () => {
    setLocalSkills([]);
    onChange?.([]);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col w-full md:w-1/2">
        <label className="text-sm mb-1" htmlFor="skill">
          Add some skills
        </label>
        <input
          className="px-2 py-1 border border-gray-400 text-black rounded outline-none focus:border-blue-500"
          id="skill"
          name="skill"
          type="text"
          maxLength={35}
          disabled={localSkills.length >= 20}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="w-full min-h-20 border border-gray-300 rounded p-3 flex flex-wrap gap-2">
        {localSkills.length > 0 ? (
          localSkills.map((skill, index) => (
            <div
              key={index}
              className="max-h-8 px-3 py-1 text-black bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSkillClick(index)}
            >
              <span className="text-sm">{skill}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        )}
      </div>
      {localSkills.length > 0 &&
        <button
          onClick={handleClearAll}
          className="self-start text-sm text-white bg-gray-600 p-1 rounded-md"
        >
          Clear all
        </button>
      }
    </div>
  );
};

export default SkillsInput;
