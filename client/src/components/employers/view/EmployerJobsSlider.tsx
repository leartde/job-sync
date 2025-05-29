import React, { useEffect, useState } from 'react';
import { Job } from "../../../types/job/Job.ts";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { motion, AnimatePresence } from 'framer-motion';

type JobsSliderProps = {
    jobs: Job[] | undefined;
};

type JobCardProps = {
    job: Job;
};

const JobCard = ({ job }: JobCardProps) => (
    <div className="flex justify-between flex-col h-64 w-48 p-4 bg-gray-900 text-white border border-gray-300 rounded-md">
        <div className="flex flex-col gap-2">
            <p className="text-sm">{separateCamelCase(job.type)}</p>
            <p className="text-xl">{job.title}</p>
            <p className="text-xs">{job.city ?? "remote"}</p>
        </div>
        <div className="flex flex-col mt-12 gap-4">
            <p className="text-md bg-white text-black rounded-md px-2">{job.pay}</p>
            <Link
                className="border bg-red-500 border-gray-800 px-2 rounded-md text-center text-xl text-white font-semibold"
                to={`/?employerId=${job.employerId}&jobId=${job.id}`}>
                View Job
            </Link>
        </div>
    </div>
);

const JobsSlider = ({ jobs }: JobsSliderProps) => {
    const [activeJobs, setActiveJobs] = useState<Job[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [direction, setDirection] = useState(0); // 0 = initial, 1 = next, -1 = prev

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth > 1280) setItemsPerPage(4);
       else if (windowWidth > 1024) setItemsPerPage(3);
        else if (windowWidth > 768) setItemsPerPage(2);
        else  setItemsPerPage(1);
    }, [windowWidth]);

    useEffect(() => {
        if (!jobs) return;
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setActiveJobs(jobs.slice(startIndex, endIndex));
    }, [jobs, currentPage, itemsPerPage]);

    const totalPages = jobs ? Math.ceil(jobs.length / itemsPerPage) : 0;

    const goToNextPage = () => {
        setDirection(1);
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const goToPrevPage = () => {
        setDirection(-1);
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const containerVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 500, damping: 30 }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-50%' : '50%',
            opacity: 0,
            transition: {
                x: { type: 'tween', duration: 0.2 },
                opacity: { duration: 0.15 }
            }
        })
    };



    return (
        <div className="flex w-full mt-4 items-center justify-center gap-4 shadow-gray-100 py-8 px-4 sm:px-16">
            <button
                onClick={goToPrevPage}
                disabled={!jobs || jobs.length <= itemsPerPage}
                className="text-white bg-gray-800 text-xl p-4 rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
                <FaArrowLeft />
            </button>

            <div className="relative flex items-center justify-center overflow-hidden w-full">
                <div className="flex gap-4 sm:gap-8 min-h-[272px] w-full justify-center">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={containerVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex gap-4 sm:gap-8 absolute"
                        >
                            {activeJobs.map((job) => (
                                <JobCard job={job} key={job.id} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <button
                onClick={goToNextPage}
                disabled={!jobs || jobs.length <= itemsPerPage}
                className="text-white bg-gray-800 text-xl p-4 rounded-full disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
                <FaArrowRight />
            </button>
        </div>
    );
};

export default JobsSlider;