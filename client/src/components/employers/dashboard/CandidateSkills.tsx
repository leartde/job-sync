import React, { useEffect, useState } from 'react';

type CandidateSkillsProps = {
  candidateSkills: string[] | undefined;
  jobSkills: string[] | undefined;
};

const CandidateSkills = ({ candidateSkills, jobSkills }: CandidateSkillsProps) => {
  const [matchingSkills, setMatchingSkills] = useState<string[]>([]);
  const [otherSkills, setOtherSkills] = useState<string[]>([]);

  useEffect(() => {
    if (candidateSkills && jobSkills) {
      const matched = candidateSkills.filter(skill => jobSkills.includes(skill));
      setMatchingSkills(matched);
      const unmatched = candidateSkills.filter(skill => !jobSkills.includes(skill));
      setOtherSkills(unmatched);
    } else {
      setMatchingSkills([]);
      setOtherSkills([]);
    }
  }, [candidateSkills, jobSkills]);

  return (
    <div className="flex flex-col p-6 border border-gray-200 rounded-lg shadow-md gap-6">
      <h2 className="font-semibold text-2xl text-white">Skills Overview</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="font-medium text-lg text-green-600 mb-2">Matching Skills</h3>
            <p className="text-sm text-gray-500">Skills that match the job requirements</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchingSkills.length > 0 ? (
              matchingSkills.map((skill) => (
                <div
                  key={skill}
                  className="bg-green-100 py-2 px-4 rounded-full border border-green-200"
                >
                  <p className="text-md text-green-800 font-medium">{skill}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No matching skills found</p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <h3 className="font-medium text-lg text-blue-600 mb-2">Other Skills</h3>
            <p className="text-sm text-gray-500">Additional skills the candidate possesses</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {otherSkills.length > 0 ? (
              otherSkills.map((skill) => (
                <div
                  key={skill}
                  className="bg-blue-50 py-2 px-4 rounded-full border border-blue-100"
                >
                  <p className="text-md text-blue-800 font-medium">{skill}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No other skills listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSkills;
