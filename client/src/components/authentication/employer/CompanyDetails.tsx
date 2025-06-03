import React, { useState } from 'react';
import { ButtonsGroup, DefaultInputDiv, InputGroup } from "../FormComponents.tsx";
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import { RegisterEmployer } from "../../../types/employer/RegisterEmployer.ts";
import { industries } from "../../../utils/Industries.ts";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { CompanyDetailsErrors } from "../../../types/employer/CompanyDetailsErrors.ts";
import { CompanyDetailsSchema } from "../../../schemas/employer/CompanyDetails.schema.ts";

const CompanyDetails = () => {
    const { registerForm, updateRegisterForm, roleData, updateRoleData } = useRegisterFormContext();
    const [formData, setFormData] = useState<RegisterEmployer>({
        name : (roleData as RegisterEmployer)?.name || "",
        email : (roleData as RegisterEmployer)?.email || "",
        industry : (roleData as RegisterEmployer)?.industry || "",
        founded : (roleData as RegisterEmployer)?.founded || new Date()
    });

    const [errors, setErrors] = useState<CompanyDetailsErrors>({});
    const handleInputChange = (e)=>{
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
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
        const result = CompanyDetailsSchema.safeParse(validationData);

        if (!result.success) {
            const newErrors = result.error.errors.reduce((acc, error) => {
                const fieldName = error.path[0] as keyof CompanyDetailsErrors;
                return {
                    ...acc,
                    [fieldName]: error.message
                };
            }, {} as CompanyDetailsErrors);

            setErrors(newErrors);
        } else {
            updateRegisterForm({ currentStep: newStep });
            updateRoleData(formData);
        }
    };

    return (
        <>
            <InputGroup>
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData?.name}
                    label="Name"
                    id="name"
                    type="text"
                    error={errors.name}
                />
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData?.email}
                    label="Company Email"
                    id="email"
                    error={errors.email}
                    type="email"/>
            </InputGroup>
            <InputGroup>
                <DefaultInputDiv value={formData.headquarters} onChange={handleInputChange} error={errors.headquarters} label="Headquarters" id="headquarters" type="text"/>
                <DefaultInputDiv value={formData.website} onChange={handleInputChange} error={errors.website} label="Website" id="website" type="text"/>
            </InputGroup>
            <InputGroup>
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData?.industry}
                    label="Industry"
                    id="industry"
                    type="select"
                    error={errors.industry}
                    options={
                        [{value: "", label: "---",disabled :true }].concat(
                            industries.map((industry) => ({
                                value: industry,
                                label: separateCamelCase(industry),
                                disabled: false
                                ,
                            }))
                        )
                    }
                />
                <DefaultInputDiv
                    onChange={handleInputChange}
                    value={formData?.founded?.toString()}
                    label="Founded Date"
                    id="founded"
                    type="date"
                    error={errors.founded}
                />
                </InputGroup>
            <ButtonsGroup  totalSteps={registerForm.steps} currentStep={registerForm.currentStep}  onClick={handleButton}/>

        </>
    );
};

export default CompanyDetails;
