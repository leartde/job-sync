import React from 'react';

const InitialsProfile = ({name}:{name:string|undefined}) => {
  return (
    <div className="flex-shrink-0 h-full w-full bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-800">
{(() => {

  const parts = (name ?? "").trim().split(/\s+/);
  if (parts.length === 0) return "";
  const firstInitial = parts[0][0] ?? "";
  const lastInitial = parts[parts.length - 1][0] ?? "";
  return (firstInitial + lastInitial).toUpperCase();
})()}                  </span>
    </div>
  );
};

export default InitialsProfile;
