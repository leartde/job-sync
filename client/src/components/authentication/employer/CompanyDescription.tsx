import React, { useEffect, useState } from 'react';
import { ButtonsGroup, DefaultInputDiv, TextAreaInput } from "../FormComponents.tsx";
import { RegisterEmployer } from "../../../types/employer/RegisterEmployer.ts";
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import { CompanyDescriptionErrors } from "../../../types/employer/CompanyDescriptionErrors.ts";
import { CompanyDescriptionSchema } from "../../../schemas/employer/CompanyDescription.schema.ts";

const CompanyDescription = () => {
    const { registerForm,updateRegisterForm, roleData, updateRoleData } = useRegisterFormContext();
    const [formData,setFormData] = useState<RegisterEmployer>(
        {
            description: (roleData as RegisterEmployer).description || "" ,
            photo : (roleData as RegisterEmployer).photo || undefined
        }
    );
    const [errors, setErrors] = useState<CompanyDescriptionErrors>({});

    useEffect(() => {
        setFormData({
            description: (roleData as RegisterEmployer).description || "" ,
            photo : (roleData as RegisterEmployer).photo || undefined
        })
    }, [roleData]);
    const handleInputChange = (e)=>{
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]:value
        }))
    }
    const handleButton = (newStep: number) => {
        alert('aaa')
        updateRoleData(formData)
        if (newStep < registerForm.currentStep) {
            updateRegisterForm({ currentStep: newStep });
            return;
        }
        setErrors({});
        const validationData = {
            ...formData,
        };
        const result = CompanyDescriptionSchema.safeParse(validationData);

        if (!result.success) {
            const newErrors = result.error.errors.reduce((acc, error) => {
                const fieldName = error.path[0] as keyof CompanyDescriptionErrors;
                return {
                    ...acc,
                    [fieldName]: error.message
                };
            }, {} as CompanyDescriptionErrors);

            setErrors(newErrors);
        } else {
            updateRegisterForm({ currentStep: newStep });
        }
    };
    return (
        <>
         <DefaultInputDiv error={errors.photo} type="file" label="Upload a logo" id="photo" />
            <TextAreaInput
                error={errors.description}
                id="description"
                value={formData.description}
                label="Enter a detailed company description"
                onChange={handleInputChange}
                />
            <ButtonsGroup buttonType="submit" totalSteps={registerForm.steps} currentStep={registerForm.currentStep} onClick={handleButton}/>
        </>
    );
};

export default CompanyDescription;
