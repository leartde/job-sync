import React, { useState } from 'react';
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import { ButtonsGroup, DefaultInputDiv } from "../FormComponents.tsx";
import SkillsInput from "./SkillsInput.tsx";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { QualificationsSchema } from "../../../schemas/jobseeker/Qualifications.schema.ts";

type QualificationsErrors = {
    resume?: string;
    skills?: string;
};

const Qualifications = () => {
    const { roleData, updateRoleData, registerForm, updateRegisterForm } = useRegisterFormContext();
    const [errors, setErrors] = React.useState<QualificationsErrors>({});
    const [formData, ] = useState<RegisterJobSeeker>({
        resume: (roleData as RegisterJobSeeker)?.resume,
        skills: (roleData as RegisterJobSeeker)?.skills || [],
    });
    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
           updateRoleData({
               resume: file,
           })
        }
    }


    const handleButton = (newStep: number) => {
        if (newStep < registerForm.currentStep) {
            updateRegisterForm({ currentStep: newStep });
            updateRoleData(formData);
            return;
        }
        setErrors({});
        const validationData = {
            ...formData,
        };
        const validation = QualificationsSchema.safeParse(validationData);
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
        else{
            updateRegisterForm({ currentStep: newStep });
        }
    };
    return (
        <>
            <DefaultInputDiv error={errors.resume} onChange={handleResumeChange}   label="Upload your resume" id="resume" type="file"/>
              <SkillsInput error={errors.skills}/>
            <ButtonsGroup totalSteps={registerForm.steps} onClick={handleButton} currentStep={4}
                          buttonType="submit">
            </ButtonsGroup>
        </>
    );
};

export default Qualifications;
