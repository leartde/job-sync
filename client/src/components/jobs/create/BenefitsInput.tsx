import React, { useEffect, useState } from 'react';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";

type BenefitsInputProps = {
  onChange?: (benefits: string[]) => void;
  value?: string[];
};

const BenefitsInput = ({ value = [], onChange }: BenefitsInputProps) => {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(value);

  const benefits = ["HealthInsurance", "PaidHoliday", "PaidTimeOff", "DentalInsurance"];

  const toggleBenefit = (benefit: string) => {
    const newBenefits = selectedBenefits.includes(benefit)
      ? selectedBenefits.filter(b => b !== benefit)
      : [...selectedBenefits, benefit];

    setSelectedBenefits(newBenefits);
    onChange?.(newBenefits);
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <label className="text-sm font-medium text-gray-200">
        Add some benefits your job offers
      </label>
      <div className="flex flex-wrap gap-2">
        {benefits.map((benefit, index) => {
          const isSelected = selectedBenefits.includes(benefit);

          return (
            <button
              key={index}
              type="button"
              onClick={() => toggleBenefit(benefit)}
              className={`
                flex items-center gap-2 
                rounded-lg px-3 py-2 
                transition-all duration-200
                ${isSelected
                ? 'bg-gray-100 text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 '}
              `}
            >
              {isSelected ? (
                <FiCheck className="text-black" />
              ) : (
                <FiPlus className="text-gray-500" />
              )}
              <span className="text-sm">{separateCamelCase(benefit)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitsInput;
