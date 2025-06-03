import React, { useState } from 'react';
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import { ButtonsGroup, DefaultInputDiv } from "../FormComponents.tsx";
import SkillsInput from "../../SkillsInput.tsx";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { QualificationsSchema } from "../../../schemas/jobseeker/Qualifications.schema.ts";

type QualificationsErrors = {
  resume?: string;
  skills?: string;
};

const Qualifications = () => {
  const { roleData, updateRoleData, registerForm, updateRegisterForm } = useRegisterFormContext();
  const [errors, setErrors] = React.useState<QualificationsErrors>({});
  const [formData, setFormData] = useState<RegisterJobSeeker>({
    resume: (roleData as RegisterJobSeeker)?.resume,
    skills: (roleData as RegisterJobSeeker)?.skills || [],
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newData = { ...formData, resume: file };
      setFormData(newData);
      updateRoleData(newData);
    }
  }

  const handleSkillsChange = (skills: string[]) => {
    const newData = { ...formData, skills };
    setFormData(newData);
    updateRoleData(newData);
  };

  const handleButton = (newStep: number) => {
    if (newStep < registerForm.currentStep) {
      updateRegisterForm({ currentStep: newStep });
      return;
    }

    setErrors({});
    const validation = QualificationsSchema.safeParse(formData);

    if(!validation.success) {
      const newErrors = validation.error.errors.reduce((acc, error) => {
        const fieldName = error.path[0] as keyof QualificationsErrors;
        return {
          ...acc,
          [fieldName]: error.message
        };
      }, {} as QualificationsErrors);
      setErrors(newErrors);
      return;
    }

    updateRegisterForm({ currentStep: newStep });
  };

  return (
    <>
      <DefaultInputDiv
        error={errors.resume}
        onChange={handleResumeChange}
        label="Upload your resume"
        id="resume"
        type="file"
      />
      <SkillsInput
        value={formData.skills ?? []}
        onChange={handleSkillsChange}
      />
      <ButtonsGroup
        totalSteps={registerForm.steps}
        onClick={handleButton}
        currentStep={4}
        buttonType="submit"
      />
    </>
  );
};

export default Qualifications;
