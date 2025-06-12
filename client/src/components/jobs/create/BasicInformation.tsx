import React, { useEffect } from "react";
import { JobErrors } from "../../../types/job/JobErrors.ts";
import { AddressErrors } from "../../../types/address/AddresErrors.ts";
import { AddressSchema } from "../../../schemas/Address.schema.ts";
import { ChangeEvent, useState } from "react";
import { AddJob } from "../../../types/job/AddJob.ts";
import useCreateJobContext from "../../../hooks/jobs/useCreateJobContext.ts";
import { JobSchema } from "../../../schemas/job/Job.schema.ts";
import { DefaultInput, SelectInput } from "./JobFormComponents.tsx";
import AddressInformation from "./AddressInformation.tsx";
import { FaArrowRight } from "react-icons/fa6";
import { CreateAddress } from "../../../types/address/CreateAddress.ts";

const BasicInformation = () => {
  const { jobData, updateJobData, formData, updateFormData } = useCreateJobContext();
  const [errors, setErrors] = useState<JobErrors>();
  const [addressErrors, setAddressErrors] = useState<AddressErrors>();

  const [form, setForm] = useState<AddJob>({
    title: "",
    type: "FullTime",
    address: undefined,
    remote: false
  });


  const [address, setAddress] = useState<CreateAddress>({
   zipCode: 0,
    country: '',
    state: '',
    city: '',
    street: '',
  });

  useEffect(() => {
    if (jobData) {
      setForm({
        title: jobData.title || "",
        type: jobData.type || "FullTime",
        address: jobData.address || null,
        remote: jobData.remote || false
      });
      if (jobData.address) {
        setAddress({
          zipCode: jobData.address.zipCode || 0,
          country: jobData.address.country || '',
          state: jobData.address.state || '',
          city: jobData.address.city || '',
          street: jobData.address.street || ''
        });
      }
    }
  }, [jobData]);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: id === "remote" ? value === "true" : value
    }));
  };
  const handleAddressChange = (field: keyof CreateAddress, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: field === 'zipCode' ? Number(value) || 0 : value
    }));
  };

  const validateAddress = (address: CreateAddress): boolean => {
    const addressValidation = AddressSchema.safeParse(address);
    if (!addressValidation.success) {
      const newErrors = addressValidation.error.errors.reduce((acc, error) => {
        const fieldName = error.path[0] as keyof AddressErrors;
        return {
          ...acc,
          [fieldName]: error.message
        };
      }, {} as AddressErrors);
      setAddressErrors(newErrors);
      return false;
    }
    else {
      setAddressErrors(null);
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setAddressErrors(null);

    const basicInfoValidation = JobSchema.pick({
      title: true,
    });

    const result = basicInfoValidation.safeParse(form);
    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, error) => {
        const fieldName = error.path[0] as keyof JobErrors;
        return {
          ...acc,
          [fieldName]: error.message
        };
      }, {} as JobErrors);
      setErrors(newErrors);
      return;
    }

    if (!form.remote) {
      const isAddressValid = validateAddress(address);
      if (!isAddressValid) return;
    }

    const updatedData = {
      ...form,
      address: form.remote ? null : address,
      remote: form.remote
    };

    updateJobData(updatedData);
    updateFormData({ currentStep: formData.currentStep + 1 });
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-4/5">
      <div className="flex flex-col gap-2 border-b-2 border-gray-300 pb-2">

        <legend className="text-2xl font-semibold text-prettyGray">Basic Information</legend>
        <DefaultInput value={form.title} onChange={handleInputChange} error={errors?.title} label="Title" name="title"/>
        <SelectInput
          value={form.type ?? "FullTime"}
          onChange={handleInputChange}
          label="Job Type"
          name="type"
          options={[
            { value: 'FullTime', label: 'Full Time' },
            { value: 'PartTime', label: 'Part Time' }
          ]}
        />

        <SelectInput
          value={form.remote ? "true" : "false"}
          onChange={handleInputChange}
          label="Job Location Type"
          name="remote"
          options={[
            { value: 'false', label: 'On Site' },
            { value: 'true', label: 'Remote' }
          ]}
        />
      </div>
      {!form.remote && (
        <AddressInformation
          form={address}
          onChange={handleAddressChange}
          errors={addressErrors}
        />
      )}
      <div className="flex justify-end">
        <button
          className="hover:bg-red-600 flex gap-1 items-center rounded-md text-lg font-medium bg-red-500 text-white py-1 px-2"
          type="submit">
          Continue
          <FaArrowRight/>
        </button>
      </div>
    </form>
  );
};

export default BasicInformation;
