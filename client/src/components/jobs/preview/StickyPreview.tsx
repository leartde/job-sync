import React, { useEffect, useState } from 'react';
import { CiBookmark, CiShare2 } from 'react-icons/ci';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import CreateJobApplication from "../../../services/jobapplication/CreateJobApplication.ts";
import { useAuth } from "../../../hooks/authentication/useAuth.ts";
import FetchJobApplication from "../../../services/jobapplication/FetchJobApplication.ts";
import CreateBookmark from "../../../services/bookmarks/CreateBookmark.ts";
import FetchBookmark from "../../../services/bookmarks/FetchBookmark.ts";
import { FaBookmark } from "react-icons/fa6";

type StickyPreviewProps = {
    id?: string;
    title?: string;
    employer?: string;
    address?: string;
    pay?: string;
    type?: string;
    image?: string;
}

const StickyPreview = ({ id, title, employer, address, pay, type, image }: StickyPreviewProps) => {
    const { user } = useAuth();
    const [hasApplied, setHasApplied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleApply = async () => {
        if (!user?.id || !id) return;
        await CreateJobApplication(user.id, id);
        setHasApplied(true);
    }

    const handleBookmark = async()=>{
        if (!user?.id || !id) return;
         await CreateBookmark(user.id, id);
        setBookmarked(true);
    }

    useEffect(() => {
        const checkIfApplied = async () => {
            try{
                if (!user?.id || !id) return;
                const application = await FetchJobApplication(id, user.id);
                if (application)setHasApplied(true);
                else setHasApplied(false);
            }
        catch {
                setHasApplied(false);
        }
        }
        checkIfApplied().then();
    }, [id, user?.id]);

    useEffect(() => {
        const checkIfBookmarked = async () => {
            if (!user?.id || !id) return;
            try {
                const bookmark = await FetchBookmark(user.id, id);
                if (bookmark)setBookmarked(true);
                else setBookmarked(false);
            } catch  {
                setBookmarked(false);
            }
        }
        checkIfBookmarked().then();
    }, [id, user?.id]);
    return (
        <div className='border flex flex-col bg-white sticky top-0'>
            <img
                className='w-full h-full rounded-md'
                src="https://d2q79iu7y748jz.cloudfront.net/s/_headerimage/1960x400/8a49f1a321d7b1562b38d0a6570f5630"
                alt="Job header"
            />
            <img
                className='h-16 w-16 max-xl:hidden rounded-md absolute left-4 top-20'
                src={image}
                alt="Company logo"
            />
            <div className='mt-6 flex-col px-4'>
                <div className='flex flex-col'>
                    <h1 className='font-semibold text-xl'>{title}</h1>
                    <a className='underline flex gap-1 items-center' href="#">
                        <p>{employer}</p>
                        <FaExternalLinkAlt size={12} />
                    </a>
                    <p>{address}</p>
                    <p>{pay} - {separateCamelCase(type)}</p>
                </div>
                <div className='flex p-2 gap-2'>
                    <button
                        onClick={handleApply}
                        disabled={hasApplied}
                        className={`text-white flex items-center gap-2 h-10 text-md font-medium px-4 rounded-lg ${
                            hasApplied ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {hasApplied ? "Applied" : "Apply now!"}
                    </button>
                    <button disabled={bookmarked} onClick={handleBookmark} className={`${bookmarked?'bg-gray-500':'bg-gray-800'} text-white  cursor-pointer rounded-xl h-10 w-10 flex items-center justify-center`}>
                       <FaBookmark className="font-semibold text-xl  " />
                    </button>
                    <div className='bg-[#E4E2E0] cursor-pointer rounded-xl h-10 w-10 flex items-center justify-center'>
                        <CiShare2 className='font-semibold text-2xl'/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StickyPreview;