import React, { useState } from 'react';
import { Address } from "../../../types/address/Address.ts";
import { CreateAddress } from "../../../types/address/CreateAddress.ts";
import { AddressErrors } from "../../../types/address/AddresErrors.ts";
import { States } from "../../../utils/AmericanStates.ts";
import DeleteJobAddress from "../../../services/job/DeleteJobAddress.ts";
import { AddressSchema } from "../../../schemas/Address.schema.ts";
import CreateJobAddress from "../../../services/job/CreateJobAddress.ts";
import { toast } from "react-toastify";
import UpdateJobAddress from "../../../services/job/UpdateJobAddress.ts";

type AddressFormProps ={
  address: Address | undefined;
  jobId: string | undefined;
  employerId: string | undefined;
}

type DeleteModalProps = {
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteModal = ({onDelete, onCancel}:DeleteModalProps)=>{
  return(
    <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold">Delete Address</h2>
        <p>Are you sure you want to delete the job address and set it to remote</p>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onDelete} className="hover:bg-red-400 bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
          <button type="button" onClick={onCancel} className="hover:bg-gray-200 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  )
}
const AddressForm = ({ address, jobId, employerId }:AddressFormProps) => {
  const [form, setForm] = useState<CreateAddress>({
    country: address?.country || 'United States',
    city: address?.city || '',
    state: address?.state || '',
    street: address?.street || '',
    zipCode: address?.zipCode,
  });

  const [locationType, setLocationType] = useState<'on-site' | 'remote'>(
    address ? 'on-site' : 'remote'
  );

  const [errors, setErrors] = useState<AddressErrors>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      [name]: name === 'zipCode' ? Number(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if(locationType == 'remote' &&  address){
      setDeleteModalOpen(true);
      return;
    }
    if(!employerId || !jobId) return;
    const validationResult = AddressSchema.safeParse(form);
    if (!validationResult.success) {
      const validationErrors: AddressErrors = {};
      validationResult.error.errors.forEach(error => {
        validationErrors[error.path[0] as keyof AddressErrors] = error.message;
      });
      setErrors(validationErrors);
      return;
    }

    const res = address
      ? await UpdateJobAddress(employerId, jobId, form)
      : await CreateJobAddress(employerId, jobId, form);

    if (res.status === 200) {
      toast.success("Job address updated successfully!");
    } else {
      toast.error("Error updating job");
    }
    }


  return (
    <div className="text-white flex flex-col border-2 border-gray-400/20 shadow-md p-4 rounded-md">
      <form className="flex flex-col justify-between h-full gap-2" onSubmit={handleSubmit}>
        {
          deleteModalOpen && (
            <DeleteModal
              onDelete={async () => {
                if (employerId && jobId) {
                  await DeleteJobAddress(employerId, jobId);
                }
                setDeleteModalOpen(false);
              }}
              onCancel={() => setDeleteModalOpen(false)}
            />
          )
        }
        <div className="flex flex-row gap-2">
          <div>
            <label> Location Type </label>
            <select
              name="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as 'on-site' | 'remote')}
              className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="on-site"> On-Site</option>
              <option value="remote"> Remote</option>
            </select>
          </div>

          {locationType === 'on-site' && (
            <div className="grid lg:grid-cols-2 grid-cols-1 p-2 border border-gray-400 gap-4 rounded-md">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="country">Country</label>
                  <select
                    className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    name="country"
                    id="country"
                    value={form.country}
                    onChange={handleInputChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                  {errors.country && <span className="text-sm text-red-600"> {errors.country}</span>}
                </div>

                {form.country === 'United States' && (
                  <div className="flex flex-col">
                    <label htmlFor="state">State</label>
                    <select
                      className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      name="state"
                      id="state"
                      value={form.state || ''}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select a state</option>
                      {States.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex flex-col">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    name="city"
                    id="city"
                    value={form.city || ''}
                    onChange={handleInputChange}
                  />
                  {errors.city && <span className="text-sm text-red-600"> {errors.city}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label htmlFor="city">Street</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    name="street"
                    id="street"
                    value={form.street || ''}
                    onChange={handleInputChange}
                  />
                  {errors.street && <span className="text-sm text-red-600"> {errors.street}</span>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-black bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    name="zipCode"
                    id="zipCode"
                    value={form.zipCode}
                    onChange={handleInputChange}
                  />
                  {errors.zipCode && <span className="text-sm text-red-600"> {errors.zipCode}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <button type="submit" className="bg-red-500 text-white px-6 py-1 rounded-md hover:bg-red-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
