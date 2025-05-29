import React, { useState } from 'react';
import { useRegisterFormContext } from "../../../hooks/authentication/useRegisterFormContext.ts";
import {
    ButtonsGroup,
    DefaultInputDiv,
    InputGroup,
} from "../FormComponents.tsx";
import { RegisterJobSeeker } from "../../../types/jobseeker/RegisterJobSeeker.ts";
import { Address } from "../../../types/address/Address.ts";
import { ContactDetailsSchema } from "../../../schemas/jobseeker/ContactDetails.schema.ts";
import { States } from "../../../utils/AmericanStates.ts";
type ContactDetailsErrors = {
    phone?: string;
    street?: string;
        city?: string;
        country?: string;
        state?: string;
        region?: string;
        zipCode?: string;

};


const ContactDetails = () => {
    const { registerForm, updateRegisterForm, roleData, updateRoleData } = useRegisterFormContext();
    const [errors, setErrors] = useState<ContactDetailsErrors>({});
    const initialAddress = (roleData as RegisterJobSeeker)?.address || {
        street: "",
        city: "",
        country: "",
        state: "",
        region: "",
        zipCode: 0
    };

    const [address, setAddress] = useState<Address>(initialAddress);
    const [phone, setPhone] = useState<string>((roleData as RegisterJobSeeker)?.phone || "");



    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [id]: id === 'zipCode' ? Number(value) || 0 : value
        }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };
    const formData = {
        ...address,
        phone
    };

    const handleButton = (newStep: number) => {
        if (newStep < registerForm.currentStep) {
            updateRegisterForm({ currentStep: newStep });
            updateRoleData({
                address: address,
                phone: phone
            });
            return;
        }
        setErrors({});
        const validationData = {
            ...formData,
        };
        const validation = ContactDetailsSchema.safeParse(validationData);
        if (!validation.success) {
                const newErrors = validation.error.errors.reduce((acc, error) => {
                    const fieldName = error.path[0] as keyof ContactDetailsErrors;
                    return {
                        ...acc,
                        [fieldName]: error.message
                    };
                }, {} as ContactDetailsErrors);
                setErrors(newErrors);
            } else {
                updateRegisterForm({ currentStep: newStep });
                updateRoleData({
                    address: address,
                    phone: phone
                });
            }
    };

    return (
        <>
            <DefaultInputDiv
                onChange={handleAddressChange}
                value={address.country}
                size="default"
                label="Country"
                id="country"
                type="select"
                options={[
                    { value: "", label: "---", disabled: true },
                    { value: "US", label: "United States" },
                    { value: "CN", label: "Canada" },
                    { value: "UK", label: "United Kingdom" },
                    { value: "AUS", label: "Australia" }
                ]}
                error={errors?.country}
            />
            <DefaultInputDiv
                value={address.street}
                onChange={handleAddressChange}
                size="default"
                label="Street"
                id="street"
                type="text"
                error={errors?.street}
            />
            <InputGroup size="small">
                <DefaultInputDiv
                    value={address.city}
                    onChange={handleAddressChange}
                    size="small"
                    label="City"
                    id="city"
                    type="text"
                    error={errors?.city}
                />
                {address.country == "US" &&
                    <DefaultInputDiv
                        value={address.state}
                        onChange={handleAddressChange}
                        size="small"
                        label="State"
                        id="state"
                        type="select"
                        options={States}
                        error={errors?.state}
                    />
                }
                <DefaultInputDiv
                    value={address.zipCode.toString()}
                    onChange={handleAddressChange}
                    size="small"
                    label="ZIP Code"
                    id="zipCode"
                    type="text"
                    error={errors?.zipCode}
                />
            </InputGroup>
            <DefaultInputDiv
                value={phone}
                onChange={handlePhoneChange}
                size="default"
                label="Phone Number"
                id="phone"
                type="text"
                error={errors?.phone}
            />

            <ButtonsGroup
                onClick={handleButton}
                totalSteps={registerForm.steps}
                currentStep={registerForm.currentStep}
            />
        </>
    );
};

export default ContactDetails;