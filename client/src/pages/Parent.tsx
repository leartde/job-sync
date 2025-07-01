import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

export type Parent = {
  id:number;
  emri: string;
}

export type Child = {
  id:number;
  parentId: number;
}
const Parent = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  // const fetchParents = async () => {
  //   const res = await axios.get('/api/parents');
  //   if(res.status === 200)setParents(res.data as Parent[]);
  // }
  //
  // const fetchChildren = async () =>{
  //   const res = await axios.get('/api/children');
  //   if(res.status === 200)setChildren(res.data as Child[]);
  // }
  // useEffect(() => {
  //
  //   fetchParents().then(fetchChildren)
  // }, []);

  // const fetchFilteredData = async (parentId: number) => {
  //   const res = await axios.get(`/api/parents/${parentId}/children`);
  //   if (res.status === 200) {
  //     setChildren(res.data as Child[]);
  //   }
  // }
  return (
    <div className="w-[90%] mx-auto flex flex-wrap gap-4 p-6">

      <div className="flex flex-col p-4 bg-gray-800/50 rounded-md w-full md:w-1/3">
        <h2 className="text-white text-lg font-semibold mb-4">Parents</h2>
        {parents?.length > 0 &&
          parents?.map((parent) => (
            <div key={parent.id} className="bg-gray-700/50 p-2 rounded-md mb-2">
              <h3 className="text-white">{parent.emri}</h3>
            </div>
          ))
        }
      </div>

      <div className="flex flex-col p-4 bg-gray-800/50 rounded-md w-full md:w-1/3">
        <h2 className="text-white text-lg font-semibold mb-4">Children</h2>
        {children?.length > 0 &&children?.map((child) => (
            <div key={child.id} className="bg-gray-700/50 p-2 rounded-md mb-2">
              <h3 className="text-white">{child.parentId}</h3>
              <Link to={`/children/${child.id}`} className="text-blue-400 hover:underline">
                Update {child.id} </Link>
            </div>
          ))}
        <Link to={`/children/1`} className="text-blue-400 hover:underline">
          Update  </Link>
      </div>

      <div className="flex flex-col rounded-md border border-gray-50 p-2">
        <h1 className="text-prettyGray font-bold text-xl">Add Parent</h1>
        <form className="space-y-2 space-x-1">
          <input className="px-2 py-1 bg-gray-500/80 text-prettyGray rounded-md" type="text"/>
          <div>
            <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition">
              Add
            </button>
          </div>

        </form>
      </div>

      <div className="flex flex-col rounded-md border border-gray-50 p-2">
        <h1 className="text-prettyGray font-bold text-xl">Add Child</h1>
        <form className="space-y-2 space-x-1">
          <input className="px-2 py-1 bg-gray-500/80 text-prettyGray rounded-md" type="text"/>
          <div>
            <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition">
              Add
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Parent;
