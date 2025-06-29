import React, { useState } from 'react';
import { FaSistrix } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { SearchBarProps } from "../../types/SearchBar.ts";


const SearchBar = ({placeholder, updateParameters}:SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [, setSearchParams] = useSearchParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        updateParameters({
            SearchTerm: searchTerm,
            PageNumber: 1
        });
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('pageNumber','1');
            newParams.set('searchTerm', searchTerm);
            return newParams;
        });
    }
    return (
        <div
            className="flex py-4 text-gray-900 justify-center w-full border-b-2 mx-auto border-white mt-8 items-center space-x-4">
            <form onSubmit={handleSubmit}
                  className='bg-white max-md:flex-col max-md:p-2 xl:w-2/3 w-full  px-2 items-center flex rounded-lg'>
                <div className='w-full rounded-lg justify-start flex items-center p-2'>
                    <FaSistrix className='text-2xl'/>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder={placeholder}
                        className='w-full border-b border-gray-400 outline-none bg-transparent p-2'
                    />
                </div>
                <button type="submit" className='active:bg-red-400 text-white bg-red-500 py-2 px-4 rounded-lg'>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
