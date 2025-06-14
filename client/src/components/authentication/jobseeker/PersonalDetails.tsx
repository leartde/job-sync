import React, { useState } from "react";
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import {
    ButtonsGroup,
    DefaultInputDiv,
    InputGroup,
} from "../FormComponents.tsx";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { JobSeekerSchema } from "../../../schemas/jobseeker/JobSeeker.schema.ts";
import { JobSeekerErrors } from "../../../types/jobseeker/JobSeekerErrors.ts";



const PersonalDetails = () => {
    const { registerForm, updateRegisterForm, roleData, updateRoleData } = useRegisterFormContext();
    const [errors, setErrors] = useState<JobSeekerErrors>({});

    const [formData, setFormData] = useState<RegisterJobSeeker>({
        firstName: (roleData as RegisterJobSeeker)?.firstName || "",
        middleName: (roleData as RegisterJobSeeker)?.middleName || "",
        lastName: (roleData as RegisterJobSeeker)?.lastName || "",
        gender: (roleData as RegisterJobSeeker)?.gender || "",
        birthday: (roleData as RegisterJobSeeker)?.birthday
            ? new Date((roleData as RegisterJobSeeker).birthday)
            : new Date()
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === "birthday" ? new Date(value) : value
        }));
    };

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
            const result = JobSeekerSchema
              .pick(
                {
                  firstName: true,
                  middleName: true,
                  lastName: true,
                  gender: true,
                }
              ).safeParse(formData)
        if (!result.success) {
                const newErrors = result.error.errors.reduce((acc, error) => {
                    const fieldName = error.path[0] as keyof JobSeekerErrors;
                    return {
                        ...acc,
                        [fieldName]: error.message
                    };
                }, {} as JobSeekerErrors);

                setErrors(newErrors);
            } else {
                updateRegisterForm({ currentStep: newStep });
                updateRoleData(formData);
            }
    }

    return (
        <>
            <InputGroup>
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData.firstName}
                    label="First Name"
                    id="firstName"
                    type="text"
                    error={errors.firstName}
                    required
                />
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData.middleName}
                    label="Middle Name"
                    id="middleName"
                    type="text"
                    error={errors.middleName}
                />
            </InputGroup>

            <InputGroup>
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData.lastName}
                    label="Last Name"
                    id="lastName"
                    type="text"
                    error={errors.lastName}
                    required
                />
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData.gender}
                    label="Gender"
                    id="gender"
                    type="select"
                    error={errors.gender}
                    required
                    options={[
                        { value: "", label: "Select Gender", disabled: true },
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" }
                    ]}
                />
            </InputGroup>

            <DefaultInputDiv
                onChange={handleInputChange}
                value={formData.birthday?.toString()}
                id="birthday"
                label="Birthday"
                type="date"
                error={errors.birthday}
                required
            />

            <ButtonsGroup
                onClick={handleButton}
                totalSteps={registerForm.steps}
                currentStep={registerForm.currentStep}
            />
        </>
    );
};

export default PersonalDetails;
