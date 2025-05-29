import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
type MultiStepFormProps = {
    children: React.ReactNode;
    title: string;
    submit: (e: React.FormEvent<HTMLFormElement>) => void;
}

type MultiStepFormWrapperProps = {
    children: React.ReactNode;
    role: string;
    currentStep: number;
    steps: number;
    title: string;
    submit: (e: React.FormEvent<HTMLFormElement>) => void;

}

type DefaultInputDivProps = {
    label: string;
    id: string;
    value?: string | readonly string[] | number | undefined
    type: string;
    size?: "default" | "small" | "big";
    options?: { value: string;
        label: string;
        disabled?: boolean
    }[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
    error? : string;
    rightIcon?: string;
}

type InputGroupProps = {
    children: React.ReactNode;
    size?: "default" | "small" | "big";

}

type StepButtonProps = {
    direction: number;
    currentStep: number;
    totalSteps: number;
    onClick: () => void;
    buttonType?: "button" | "submit";
}

type ButtonsGroupProps = {
    currentStep: number;
    totalSteps: number;
    onClick: (step: number) => void;
    buttonType?: "button" | "submit";

}

type TextAreaInputProps = {
    id: string;
    value?: string | readonly string[] | number | undefined;
    label?: string;
    onChange?: (e:React.ChangeEvent<HTMLTextAreaElement>)=>void;
    error? : string;
}

 export const MultiStepForm = ({ children,title, submit } : MultiStepFormProps) => {
    return <form onSubmit={submit} method="post" encType="multipart/form-data" className="w-full flex flex-col gap-2 items-start p-2" >
        <legend className="text-md font-semibold">
            {title}
        </legend>
        {children}</form>;
 };

export const MultiStepFormWrapper = ({ children, role, currentStep, steps, title, submit } : MultiStepFormWrapperProps ) => {
    return (
        <div className="mx-auto w-1/2 md:w-2/3 xl:w-1/3 rounded-md mt-16 flex flex-col items-center bg-white p-6">
            <h1 className="text-xl font-bold text-black mb-4">
                Register as {role.startsWith('e') ? 'an' : 'a'} <span className="text-red-500">{role}</span>
            </h1>
            <div className="w-full">
                <MultiStepForm submit={submit} title={title}>
                    {children}
                </MultiStepForm>
                <p className="float-right text-md text-red-500">{currentStep}/{steps}</p>

            </div>
        </div>
    )
}

export const DefaultInputDiv = ({ label, id, value, type, options,size = "default",onChange,error, rightIcon}: DefaultInputDivProps) =>{
    const [showPassword,setShowPassword] = useState(false);
    return (
        <div className={`flex flex-col ${
            size === "small"
                ? "w-full md:w-1/4"
                : size === "big"
                    ? "w-full md:w-3/4"
                    : "w-full md:w-1/2"
        }`}>

            <label className="text-sm" htmlFor={id}>
                {label}
            </label>
            {(type === "text" || type === "email" || type === "birthday" || type === "password" || type === "date" || type === "file") && (

                <div className="flex">
                    <input
                        onChange={onChange}
                        value={value}
                        className={`px-1 border border-gray-400 outline-none rounded w-[90%] ${type === "file" ? 'py-1' : ''}`}
                        id={id}
                        name={id}
                        type={showPassword && type === "password" ? "text" : type}
                    />
                    {rightIcon === "eye" &&
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center ml-2 text-xl text-gray-600" >
                            {!showPassword ? <FaRegEyeSlash/> : <FaRegEye/>}
                        </button>}
                </div>

            )}
            {type === "select" &&
                <select value={value} name={id} id={id} onChange={onChange}
                        className="border border-gray-400 outline-none rounded px-1">
                    {options?.map((option, index) => (
                        <option key={index} disabled={option.disabled} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            }
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
    )

}

export const TextAreaInput = ({id,label,value,onChange, error}:TextAreaInputProps)=>{
    return(
        <div className="flex flex-col w-full">
            <label className="text-sm" htmlFor={id}>
                {label}
            </label>
            <textarea  id={id} name={id} value={value} onChange={onChange} className="px-1 border h-64 border-gray-400 outline-none rounded w-[90%]"/>
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
    )
}

export const InputGroup = ({ children, size = "default" }: InputGroupProps) => {
    return (
        <div className={`w-full flex max-md:flex-col ${size === "small" ? "justify-start gap-6" : "justify-between gap-2 mt-2"}`}>
            {children}
        </div>
    );
};






export const StepButton = ({ direction, currentStep,totalSteps, onClick,buttonType } : StepButtonProps) => {
    return (
        <button type={buttonType}
                onClick={onClick}
                className={`${currentStep < direction?'bg-red-500':'bg-blue-500'} text-white py-1 w-20 text-md text-center font-medium px-4 rounded-lg`}>

            {currentStep < direction?
                currentStep != totalSteps?"Next":"Finish"
                :"Back"}
        </button>
    )
}

export const ButtonsGroup = ({ currentStep, onClick,buttonType ="button",totalSteps } : ButtonsGroupProps) => {
    return (
        <div className="flex gap-2 relative top-4">
            <StepButton
                buttonType = "button"
                onClick={() => onClick(currentStep - 1)}
                currentStep={currentStep}
                totalSteps={totalSteps}
                direction={currentStep - 1}
            />
            <StepButton
                buttonType = {buttonType}
                onClick={() => currentStep < totalSteps ? onClick(currentStep + 1) : onClick(currentStep)}
                currentStep={currentStep}
                totalSteps={totalSteps}
                direction={currentStep + 1}
            />
        </div>
    )
}


