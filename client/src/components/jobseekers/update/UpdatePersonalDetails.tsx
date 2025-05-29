import React, { useEffect, useState } from 'react';
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { JobSeeker } from "../../../types/jobseeker/JobSeeker.ts";
import { User } from "../../../types/authentication/User.ts";
import UpdateJobSeeker from "../../../services/jobseeker/UpdateJobSeeker.ts";
import { toast } from "react-toastify";
import { PersonalDetailsErrors } from "../../../types/jobseeker/PersonalDetailsErrors.ts";
import { personalDetailsSchema } from "../../../schemas/jobseeker/PersonalDetails.schema.ts";

type PersonalDetailsUpdateProps = {
    user: User | null,
    profile : JobSeeker | undefined
}

type InputDivProps = {
    label: string;
    name: string | undefined;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | undefined;
}
export const InputDiv = ({label, name, value, onChange, error} : InputDivProps)=> {
    return (
        <div className="flex flex-col gap-2 justify-start ">
            <div className="flex items-center">
                <label htmlFor={name} className="w-1/3">{label}</label>
                <input value={value} onChange={onChange} type="text" name={name}
                       id={name}
                       className="w-2/3 bg-gray-800 text-white py-1 px-2 rounded-md"/>
            </div>
            <p className="text-red-500 text-sm"> {error} </p>
        </div>
    )
}
const UpdatePersonalDetails = ({ profile, user }: PersonalDetailsUpdateProps) => {
    const [formData, setFormData] = useState<RegisterJobSeeker>({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<PersonalDetailsErrors>({});

    useEffect(() => {
        setFormData({
            firstName: profile?.firstName,
            middleName: profile?.middleName,
            lastName: profile?.lastName,
            phone: profile?.phone,
            gender: profile?.gender,
            birthday: profile?.birthday,
        })
    }, [profile]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const validationData = {
            ...formData,
        };
        const validationResult = personalDetailsSchema.safeParse(validationData);
        setLoading(true);
        if (!validationResult.success) {
            const newErrors = validationResult.error.errors.reduce((acc, error) => {
                const fieldName = error.path[0] as keyof PersonalDetailsErrors;
                return {
                    ...acc,
                    [fieldName]: error.message
                };
            }, {} as PersonalDetailsErrors);
            setErrors(newErrors);
            setLoading(false);
            return;
        }
        const result = await UpdateJobSeeker(user?.id ?? "", formData);
        if (result.status === 200)toast.success("Profile updated successfully");
        else toast.error("Error updating profile");
        setLoading(false);
    }
    return (
        <div className="flex flex-start p-4 md:w-2/3 xl:w-1/2 border border-gray-600 rounded-lg shadow-sm">
            {loading && (
                <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="mt-4">Updating your profile...</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="" method="POST">
                <legend className="font-semibold">Update personal details</legend>
                <InputDiv onChange={handleInputChange} label="First Name" error={errors.firstName} name="firstName" value={formData.firstName} />
                <InputDiv onChange={handleInputChange} label="Middle Name" error={errors.middleName} name="middleName" value={formData.middleName} />
                <InputDiv onChange={handleInputChange} label="Last Name" error={errors.lastName} name="lastName" value={formData.lastName} />
                <InputDiv onChange={handleInputChange} label="Phone Number" error={errors.phone} name="phone" value={formData.phone} />
                <div className="flex flex-col gap-2">
                    <div className="flex">
                        <label htmlFor="gender" className="w-1/3">Gender</label>
                        <select value={formData.gender} name="gender" id="gender" onChange={handleInputChange}
                                className="w-2/3 bg-gray-800 text-white py-1 px-2 rounded-md">
                            <option value="" disabled>---</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <p className="text-red-500 text-sm"> {errors.gender} </p>

                </div>
                <div className="flex flex-col gap-2 justify-start">
                    <div className="flex items-center">
                        <label htmlFor="birthday" className="w-1/3">Birthday</label>
                        <input onChange={handleInputChange} value={formData.birthday?.toString()} type="date"
                               name="birthday" id="birthday"
                               className="w-2/3 bg-gray-800 text-white py-1 px-2 rounded-md"/>
                    </div>
                    <p className="text-red-500 text-sm"> {errors.birthday} </p>
                </div>
                <div>
                    <button className="hover:bg-red-400 bg-red-500 px-8 py-1 rounded-md">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePersonalDetails;
