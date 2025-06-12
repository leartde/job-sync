import React from 'react';
import { DefaultInput, SelectInput } from "./JobFormComponents.tsx";
import { AddressErrors } from "../../../types/address/AddresErrors.ts";
import { CreateAddress } from "../../../types/address/CreateAddress.ts";
import { States } from "../../../utils/AmericanStates.ts";

type AddressInformationProps = {
  form: CreateAddress;
  onChange: (field: keyof CreateAddress, value: string) => void;
  errors?: AddressErrors;
}

const AddressInformation = ({ form, onChange, errors }: AddressInformationProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    onChange(id as keyof CreateAddress, value);

  };

  return (
    <div className="flex flex-col gap-2 border-b-2 border-gray-300 pb-2">
      <legend className="text-xl font-semibold text-prettyGray">Address Information</legend>
      <SelectInput label="Country" name="country" options={
        [
          { value: 'United States', label: 'United States' },
          { value: 'Canada', label: 'Canada' },
          { value: 'United Kingdom', label: 'United Kingdom' }
        ]
      } value={form.country ?? "United States"} onChange={handleInputChange} error={errors?.country} />
      <SelectInput value={form.state ?? "AL"} onChange={handleInputChange} label="State" name="state" options={
        States.map(state => ({ value: state, label: state}))
      }/>
      <DefaultInput value={form.city} onChange={handleInputChange} error={errors?.city} label="City" name="city"/>
      <DefaultInput value={form.street} onChange={handleInputChange} error={errors?.street} label="Street" name="street"/>
      <DefaultInput value={form.zipCode} onChange={handleInputChange} error={errors?.zipCode} label="Zip Code" name="zipCode"/>
    </div>
  );
};

export default AddressInformation;
