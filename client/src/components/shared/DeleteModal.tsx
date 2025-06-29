import React from "react";

type DeleteModalProps = {
  onDelete: () => void;
  onCancel: () => void;
  title? : string;
  paragraph? : string;
}

const DeleteModal = ({onDelete, onCancel, title, paragraph}:DeleteModalProps)=>{
  return(
    <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p>{paragraph}</p>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onDelete} className="hover:bg-red-400 bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
          <button type="button" onClick={onCancel} className="hover:bg-gray-200 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  )
}
export default DeleteModal;
