import React from "react";

type DefaultInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error? : string
  prefix?: string;
}
export const DefaultInput = ({ label, name, type = "text", placeholder, value, maxLength, onChange, error, prefix }: DefaultInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <div className="flex items-stretch w-full md:w-2/3 lg:w-1/2">
        {prefix && (
          <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-600 bg-gray-200 text-gray-700">
            {prefix}
          </span>
        )}
        <input
          onChange={onChange} value={value} maxLength={maxLength} placeholder={placeholder}
          className={`w-full px-3 py-1 border border-gray-600 ${prefix ? 'rounded-r-lg' : 'rounded-lg'} bg-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          type={type} name={name} id={name}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}

type SelectInputProps = {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  value?: string | readonly string[] | number | undefined ;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const SelectInput = ({label, name, options, value, onChange, error}:SelectInputProps)=>{
  return (
    <div className="flex flex-col gap-1 ">
      <label className="" htmlFor={name}>{label}</label>
      <select name={name} id={name} onChange={onChange} value={value} className="w-full bg-gray-300 md:w-2/3 lg:w-1/2 border-gray-600 border rounded-lg px-2 py-1 text-gray-700 ">
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-sm text-red-600">{error}</span>
    </div>
  )
}
