import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAuth } from "../../hooks/authentication/useAuth.ts";
import { Employer } from "../../types/employer/Employer.ts";
import FetchEmployer from "../../services/employer/FechEmployer.ts";
import { industries } from "../../utils/Industries.ts";
import { separateCamelCase } from "../../helpers/StringHelpers.ts";
import { RegisterEmployer } from "../../types/employer/RegisterEmployer.ts";
import UpdateEmployer from "../../services/employer/UpdateEmployer.ts";
import { useNavigate } from "react-router-dom";

type InputProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputDiv = ({name, label, defaultValue, onChange, type = "text", required = false }: InputProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span>*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full px-4 py-2 text-black bg-gray-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        required={required}
      />
    </div>
  );

}

const UpdateCompanyForm = () => {
  const { user } = useAuth();
  const [employerData, setEmployerData] = useState<Employer>();
  const [form, setForm] = useState<RegisterEmployer>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (user) {
        const res = await FetchEmployer(user.id);
        if (res.status === 200) setEmployerData(res.data)
      }
    }
    fetchEmployerData().then()
  }, [user]);

  useEffect(() => {
    if (employerData) {
      setForm({
        name: employerData.name,
        email: employerData.email,
        headquarters: employerData.headquarters,
        website: employerData.website || '',
        phone: employerData.phone,
        industry: employerData.industry,
        founded: employerData.founded ,
        description: employerData.description || '',
        photo: undefined
      } );
    }
  }, [employerData]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  }
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, photo: file }));
    }
  }
  const handleSubmit = async (e)=> {
    e.preventDefault();
    if (user) {
      const result = await UpdateEmployer(user.id, form);
      if (result.status === 200) {
        navigate(`/employer-dashboard`)
      } else {
        console.error("Error updating company details:", result);
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto border border-gray-300 text-white rounded-lg shadow-md overflow-hidden p-6 my-8">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-prettyGray">Update your company details</h1>
        <p className="mt-1">Keep your company information up to date</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <InputDiv name="name" required={true} onChange={handleInputChange} label="Company Name" defaultValue={form?.name}/>

         <InputDiv name="email" required={true} onChange={handleInputChange} label="Company Email" type="email" defaultValue={form?.email} />

          <InputDiv name="headquarters" onChange={handleInputChange} label="Headquarters" required={true} defaultValue={form?.headquarters} />
        </div>

        <div className="space-y-4">
          <InputDiv name="website" onChange={handleInputChange} defaultValue={form?.website} label="Website"/>

          <InputDiv name="phone" onChange={handleInputChange} type="tel" defaultValue={form?.phone} label="Company Phone Number" />

          <div>
            <label htmlFor="industry"  className="block text-sm font-medium mb-1">
              Industry *
            </label>
            <select
              onChange={handleInputChange}
              id="industry"
              name="industry"
              value={form?.industry}
              className="w-full px-4 py-2 text-black bg-gray-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {separateCamelCase(industry)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <InputDiv
            name="founded"
            type="date"
            onChange={handleInputChange}
            required={true}
            defaultValue={form?.founded ? new Date(form.founded).toISOString().split('T')[0] : ''}
            label="Founded Date"/>

          <InputDiv onChange={handleImageChange} name="photo" type="file" value={form.photo} label="Company Logo" />

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description*
            </label>
            <textarea
              onChange={handleInputChange}
              required
              id="description"
              name="description"
              defaultValue={form?.description}
              className="w-full px-4 py-2 text-black bg-gray-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32"
            />
          </div>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
          >
            Update Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCompanyForm;
