import React, { useEffect, useState } from 'react';
import { AddJob } from "../../../types/job/AddJob.ts";
import { Job } from "../../../types/job/Job.ts";
import UpdateJob from "../../../services/job/UpdateJob.ts";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import { JobErrors } from "../../../types/job/JobErrors.ts";
import { JobSchema } from "../../../schemas/job/Job.schema.ts";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";

const Details = ({job}:{job:Job | undefined}) => {
  const { user } = useAuth();
  const [form, setForm] = useState<AddJob>({});
  const [errors, setErrors] = useState<JobErrors>();

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        description: job.description,
        type: job.type,
        hourlyPay: job.hourlyPay,
        hasMultipleSpots: job.hasMultipleSpots,
        isTakingApplications: job.isTakingApplications,
      });
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'hourlyPay' ? Number(value) || 0 : value
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setForm(prev => ({ ...prev, image: selectedFile }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrors({});
    e.preventDefault();
    const validationResult = JobSchema.safeParse(form);
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, error)=>{
        const fieldName = error.path[0] as keyof JobErrors;
        return {
          ...acc,
          [fieldName]: error.message
        };
      },{} as JobErrors )
      setErrors(newErrors);
      return;
    }

    if (!user || !job) return;
    const res = await UpdateJob(user.id, job.id, form);
    if (res) {
      toast.success("Job updated successfully");
    } else {
      console.error("Failed to update job");
    }
  };

  return (
    <div className="text-white flex flex-col border-2 border-gray-400/20 shadow-md p-4 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title || ''}
                onChange={handleInputChange}
                required
                className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors?.title && <span className="text-sm text-red-600"> {errors?.title} </span>}
            </div>
            <div>
              <label htmlFor="hourlyPay" className="block text-sm font-medium mb-1">
                Hourly Pay
              </label>
              <div className="flex items-center">
  <span className="bg-gray-300 text-gray-900 px-2 py-1 rounded-l-md border border-gray-300 border-r-0">
    $
  </span>
                <input
                  type="number"
                  id="hourlyPay"
                  name="hourlyPay"
                  value={form.hourlyPay ?? ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  required
                  className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

              </div>
              {errors?.hourlyPay && <span className="text-sm text-red-600"> {errors?.hourlyPay} </span>}

            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="hasMultipleSpots" className="block text-sm font-medium mb-1">
                Has Multiple Spots
              </label>
              <select
                id="hasMultipleSpots"
                name="hasMultipleSpots"
                value={form.hasMultipleSpots?.valueOf().toString() || ''}
                onChange={handleInputChange}
                required
                className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="isTakingApplications" className="block text-sm font-medium mb-1">
                Currently Taking Applications
              </label>
              <select
                id="isTakingApplications"
                name="isTakingApplications"
                value={form.isTakingApplications?.valueOf().toString() || ''}
                onChange={handleInputChange}
                required
                className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium mb-1">
                Image
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="max-w-80">
              <label htmlFor="description" className="block text-sm font-medium mb-1 ">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={form.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Enter job description..."
                className="h-48 text-gray-900 mb-8"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
              />
            </div>
            {errors?.description && <span className="text-sm text-red-600 mt-2"> {errors?.description} </span>}

          </div>
          <button type="submit" className="bg-red-500 py-1 w-1/2 hover:bg-red-600 rounded-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Details;
