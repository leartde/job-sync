import React, { ChangeEvent, useState } from 'react';
import useCreateJobContext from "../../../hooks/jobs/useCreateJobContext.ts";
import { DefaultInput, SelectInput } from "./JobFormComponents.tsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { JobErrors } from "../../../types/job/JobErrors.ts";
import { AddJob } from "../../../types/job/AddJob.ts";
import { JobSchema } from "../../../schemas/job/Job.schema.ts";

const Description = () => {
  const { jobData, updateJobData, formData, updateFormData } = useCreateJobContext();
  const [errors, setErrors] = useState<JobErrors>();
  const [form, setForm] = useState<AddJob>({
    hourlyPay: jobData.hourlyPay ||  0,
    description: jobData.description || "",
    hasMultipleSpots: jobData.hasMultipleSpots || false,
    image: jobData.image
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev,
      [id]: id=== 'hourlyPay' ? Number(value) || 0 : value}));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
    }
  }
  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    const validationResult = JobSchema
      .pick({
        hourlyPay: true,
        description: true
      }).safeParse(form);
    if (!validationResult.success) {
        const newErrors = validationResult.error.errors.reduce((acc, error) => {
          const fieldName = error.path[0] as keyof JobErrors;
          return {
            ...acc,
            [fieldName]: error.message
          };
        }, {} as JobErrors);
        setErrors(newErrors);
        return;
    }
    updateJobData(form);
    updateFormData({ currentStep: formData.currentStep + 1 });

  };


  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit} className="flex flex-col gap-4 w-4/5">
      <div className="flex flex-col gap-4">
        <legend className="text-xl font-semibold text-prettyGray">Describe the job</legend>

        <DefaultInput
          name="hourlyPay"
          id="hourlyPay"
          prefix="$"
          value={form.hourlyPay}
          onChange={handleInputChange}
          label="Hourly Pay"
          type="number"
          error={errors?.hourlyPay}
        />

        <div className="flex flex-col gap-1">
          <label>Job Description</label>
          <ReactQuill
            theme="snow"
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Enter job description..."
            className="h-48 w-full md:w-2/3 lg:w-1/2 text-gray-900 mb-8"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]
            }}
          />
          {errors?.description && <span className={"mt-2 text-sm text-red-600"}> {errors?.description}</span>}
        </div>

        <SelectInput onChange={handleInputChange} value={form.hasMultipleSpots?.valueOf().toString()} label="This is hiring multiple candidates" name="hasMultipleSpots" options={
          [
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]
        }
        />
        <DefaultInput onChange={handleImageChange} label="Add a descriptive picture" name="photo" type="file"/>
        <div className="flex justify-between mt-4">
          <button
            className="hover:bg-red-600 flex gap-1 items-center rounded-md text-lg font-medium bg-red-500 text-white py-1 px-2"
            type="button"
            onClick={() => updateFormData({ currentStep: formData.currentStep - 1 })}
          >
            <FaArrowLeft/> Previous
          </button>
          <button
            className="hover:bg-red-600 flex gap-1 items-center rounded-md text-lg font-medium bg-red-500 text-white py-1 px-2"
            type="submit"
          >
            Continue <FaArrowRight/>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Description;
