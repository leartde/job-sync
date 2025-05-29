import React, { useState } from 'react';
import { MultiStepFormWrapper } from "../FormComponents.tsx";
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import AccountDetails from "../AccountDetails.tsx";
import PersonalDetails from "./PersonalDetails.tsx";
import ContactDetails from "./ContactDetails.tsx";
import Qualifications from "./Qualifications.tsx";
import CreateJobSeeker from "../../../services/jobseeker/CreateJobSeeker.ts";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../../types/authentication/RegisterUser.ts";
import { toast } from 'react-toastify';
import { FaTruckLoading } from "react-icons/fa";
type CreateJobSeekerResponse = {
    status: number;
    data: { user: RegisterUser, jobSeeker: RegisterJobSeeker };
};

const JobSeekerRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { registerForm, userData, roleData } = useRegisterFormContext();
    const currentStep = registerForm.currentStep;

    const titles = {
        1: "Account Details",
        2: "Personal Details",
        3: "Contact Details",
        4: "Qualifications"
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        try {
            const result: CreateJobSeekerResponse = await CreateJobSeeker({
                email: userData.email,
                password: userData.password,
                role: "jobseeker",
                jobSeeker: (roleData as RegisterJobSeeker)
            });

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
    };

    return (
        <>
            <MultiStepFormWrapper
                submit={handleSubmit}
                currentStep={currentStep}
                steps={4}
                title={titles[currentStep]}
                role="jobseeker"
                isLoading={loading}
            >
                {currentStep === 1 && <AccountDetails />}
                {currentStep === 2 && <PersonalDetails />}
                {currentStep === 3 && <ContactDetails />}
                {currentStep === 4 && <Qualifications />}
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

export default JobSeekerRegistration;