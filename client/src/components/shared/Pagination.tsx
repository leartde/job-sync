import React from 'react';
import { useSearchParams } from "react-router-dom";
import { PaginationProps } from "../../types/Pagination.ts";

const Pagination = ({headers}:PaginationProps) => {
    const [, setSearchParams] = useSearchParams();
    if (!headers || headers.TotalPages < 1) return null;
    const handlePageClick = (num: number) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('pageNumber', num.toString());
            return newParams;
        });
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 20, behavior: 'instant' });
        }
    };
    const getPageRange = () => {
        const { CurrentPage, TotalPages } = headers;
        const range = [];

        if (window.innerWidth >= 768) {
            range.push(1);

            let start = Math.max(2, CurrentPage - 2);
            let end = Math.min(TotalPages - 1, CurrentPage + 2);

            if (CurrentPage <= 3) {
                end = Math.min(5, TotalPages - 1);
            }
            if (CurrentPage >= TotalPages - 2) {
                start = Math.max(TotalPages - 4, 2);
                end = TotalPages - 1;
            }

            if (start > 2) range.push('...');
            for (let i = start; i <= end; i++) range.push(i);
            if (end < TotalPages - 1) range.push('...');
            if (TotalPages > 1) range.push(TotalPages);
        } else {
            if (CurrentPage > 1) {
                range.push(1);
                range.push('...');
            }
            range.push(CurrentPage);
            if (CurrentPage < TotalPages) range.push('...');
            if (TotalPages > 1 && CurrentPage < TotalPages) range.push(TotalPages);
        }

        return range;
    };

    const pageRange = getPageRange();
    return (
        <div className="w-full p-2 space-x-2 mt-16 mx-auto flex justify-center items-center">
            {headers.HasPrevious && (
                <button
                    onClick={() => handlePageClick(headers.CurrentPage - 1)}
                    className="active:bg-red-400 active:text-white bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                    Previous
                </button>
            )}

            {pageRange.map((item, index) => (
                item === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-white">...</span>
                ) : (
                    <button
                        key={item}
                        onClick={() => handlePageClick(item as number)}
                        className={`px-4 py-2 rounded-md active:bg-red-400 active:text-white ${
                            headers.CurrentPage === item
                                ? "bg-red-500 text-white"
                                : "bg-white text-red-500 hover:bg-gray-100"
                        }`}
                    >
                        {item}
                    </button>
                )
            ))}

            {headers.HasNext && (
                <button
                    onClick={() => handlePageClick(headers.CurrentPage + 1)}
                    className="active:bg-red-400 active:text-white bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;
