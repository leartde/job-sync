import React, { useState } from 'react';
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import { MultiStepFormWrapper } from "../FormComponents.tsx";
import AccountDetails from "../AccountDetails.tsx";
import CompanyDetails from "./CompanyDetails.tsx";
import CompanyDescription from "./CompanyDescription.tsx";
import CreateEmployer from "../../../services/employer/CreateEmployer.ts";
import { RegisterEmployer } from "../../../types/employer/RegisterEmployer.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";

const EmployerRegistration = () => {
    const { registerForm, userData, roleData } = useRegisterFormContext();
    const currentStep = registerForm.currentStep;
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const titles = {
        1: "Account Details",
        2: "Company Details",
        3: "Company Description",
    };


    const handleSubmit = async(e)=>{
    try{
        e.preventDefault();
        const result = await CreateEmployer({
            email : userData.email,
            password: userData.password,
            employer : roleData as RegisterEmployer
        })
        if (result.status === 200) {
            toast.success("Registration successful!");
            navigate("/");
        } else {
            setSubmitError("Registration failed. Please try again.");
            toast.error("Registration failed");
        }
    } catch (error) {
        console.error("Registration error:", error);
        setSubmitError("An unexpected error occurred. Please try again later.");
        toast.error("An unexpected error occurred");
    } finally {
        setLoading(false);
    }
    }


    return (
        <>
         <MultiStepFormWrapper role="employer" currentStep={currentStep} steps={registerForm.steps} title={titles[currentStep]} submit={handleSubmit}>
             { currentStep == 1 && <AccountDetails/>}
             { currentStep == 2 && <CompanyDetails/>}
             { currentStep == 3 && <CompanyDescription/>}
         </MultiStepFormWrapper>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <FaTruckLoading/>
                        <p className="mt-4">Creating your account...</p>
                    </div>
                </div>
            )}

            {submitError && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {submitError}
                </div>
            )}
        </>
    );
};

export default EmployerRegistration;
