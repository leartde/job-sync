import { useRegisterFormContext } from "../../hooks/authentication/useRegisterFormContext.ts";
import { ButtonsGroup, DefaultInputDiv } from "./FormComponents.tsx";
import { useState } from "react";
import { AccountDetailsSchema } from "../../schemas/AccountDetails.schema.ts";

type AccountDetailsErrors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
};
const AccountDetails = () => {
    const {  registerForm, updateRegisterForm, userData, updateUserData } = useRegisterFormContext();
    const [errors, setErrors] = useState<AccountDetailsErrors>({});
    const [formData, setFormData] = useState({
        email: userData.email,
        password: "",
        confirmPassword: ""
    });
    const handleButton = (newStep: number) => {
        if (newStep < registerForm.currentStep) {
            updateRegisterForm({ currentStep: newStep });
            updateUserData(formData);
            return;
        }
        setErrors({});
        const result = AccountDetailsSchema.safeParse(formData);
        if(!result.success){
            const newErrors = result.error.errors.reduce((acc, error) => {
                const fieldName = error.path[0] as keyof AccountDetailsErrors;
                return {
                    ...acc,
                    [fieldName]: error.message
                };
            }, {} as AccountDetailsErrors);
            setErrors(newErrors);
            return;
        }

        else{
            updateRegisterForm({ currentStep: newStep });
            updateUserData({
                email: formData.email,
                password: formData.password
            });
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    }

    return (
        <>
            <DefaultInputDiv
                onChange={handleInputChange}
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                error={errors.email}
            />
            <DefaultInputDiv
                onChange={handleInputChange}
                label="Password"
                id="password"
                type="password"
                value={formData.password}
                error={errors?.password}
                rightIcon="eye"
            />
            <DefaultInputDiv
                onChange={handleInputChange}
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                error={errors?.confirmPassword}
                rightIcon="eye"
            />
            <ButtonsGroup totalSteps={registerForm.steps} onClick={handleButton} currentStep={registerForm.currentStep} />

</>    );
}

export default AccountDetails;