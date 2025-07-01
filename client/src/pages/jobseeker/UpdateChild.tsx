import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { Child } from "../Parent.tsx";

const UpdateChild = () => {

  const {id} = useParams();

  const [child, setChild] = useState<Child>();

  // useEffect(() => {
  //   const fetchChild = async () => {
  //     const res = await axios.get(`/api/children/${id}`);
  //     if (res.status === 200)setChild(child)
  //   }
  //   fetchChild().then()
  // }, [id]);

  const [attribute, setAttribute] = useState('');
  const handleSubmit = async(e)=>{
    e.preventDefault();
  const res = await axios.put('/api/children/1', {

  })
  }
  return (
    <div className="w-[90%] mx-auto text-prettyGray p-4 bg-gray-900/50 ">
      <form className="flex flex-col items-center justify-center gap-4">
        <legend className="text-xl font-semibold ">Update Entity</legend>
        <div>
          <input onChange={(e)=>setAttribute(e.target.value)} defaultValue={child?.id} placeholder="Attribute" className="bg-gray-700/80 rounded-md px-2 py-1 border border-gray-50" type="text"/>
        </div>

        <div>
          <button className="px-2 py-1 bg-red-500 text-white rounded-md" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateChild;
