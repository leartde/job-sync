import React, { useEffect, useState } from 'react';
import { AddressErrors } from "../../../types/address/AddresErrors.ts";
import { User } from "../../../types/authentication/User.ts";
import { Address } from "../../../types/address/Address.ts";
import UpdateJobSeekerAddress from "../../../services/jobseeker/UpdateJobSeekerAddress.ts";
import FetchJobSeekerAddress from "../../../services/jobseeker/FetchJobSeekerAddress.ts";
import { ContactDetailsSchema } from "../../../schemas/jobseeker/ContactDetails.schema.ts";
import { InputDiv } from "./UpdatePersonalDetails.tsx";
import { States } from "../../../utils/AmericanStates.ts";
import { toast } from "react-toastify";

type UpdateAddressProps = {
    user:  User | null,

}
const UpdateAddress = ({user}:UpdateAddressProps) => {
    const [errors, setErrors] = useState<AddressErrors>();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Address>({
        street: "",
        city: "",
        state: "",
        country: "",
        region: "",
        zipCode: 0
    });
    useEffect(() => {
        const fetchAddress = async () => {
            const address = await FetchJobSeekerAddress(user?.id ?? "");
            setFormData(address);
        }
         fetchAddress().then();

    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e)=>{
      if(!user?.id)return;
      e.preventDefault();
        setErrors({});
        const validationResult = ContactDetailsSchema.safeParse(formData);
        if (!validationResult.success) {
            const newErrors = validationResult.error.errors.reduce((acc, error) => {
                const fieldName = error.path[0] as keyof AddressErrors;
                return {
                    ...acc,
                    [fieldName]: error.message
                };
            }, {} as AddressErrors);
            await UpdateJobSeekerAddress(user?.id ?? "", formData);
            setErrors(newErrors);
            setLoading(false);
            return;
        }
      const result = await UpdateJobSeekerAddress(user.id, formData);
        if (result.status === 200)toast.success("Address updated successfully");
        else toast.error("Error updating Address");
    }

    return (
        <div className="flex flex-start p-4 md:w-2/3 xl:w-1/2 border border-gray-600 rounded-lg shadow-sm">
            {loading && (
                <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <p className="mt-4">Updating your address...</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="" method="POST">
                <legend className="font-semibold">Update your address</legend>
                <div className="flex flex-col gap-2">
                    <div className="flex">
                        <label htmlFor="address" className="w-1/3">Country</label>
                        <select value={formData.country} name="country" id="country" onChange={handleChange}
                                className="w-2/3 bg-gray-800 text-white py-1 px-2 rounded-md">
                            <option value="" disabled>---</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                        </select>
                    </div>
                    <p className="text-red-500 text-sm"> {errors?.country} </p>

                </div>
                <InputDiv label="City" name="city" value={formData.city} onChange={handleChange} error={errors?.city}/>
                <InputDiv label="Street" name="street" value={formData.street} onChange={handleChange} error={errors?.street}/>
                {formData.country === "United States" &&
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <label htmlFor="state" className="w-1/3">State</label>
                            <select value={formData.country === 'United States'?formData.state:''} name="state" id="state" onChange={handleChange}
                                    className="w-2/3 bg-gray-800 text-white py-1 px-2 rounded-md">
                                {
                                    States.map((state)=>(
                                        <option key={state} value={state}>{state}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <p className="text-red-500 text-sm"> {errors?.country} </p>

                    </div>
                }
                <InputDiv label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange}
                          error={errors?.zipCode}/>
                <div>
                    <button className="hover:bg-red-400 bg-red-500 px-8 py-1 rounded-md">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateAddress;
