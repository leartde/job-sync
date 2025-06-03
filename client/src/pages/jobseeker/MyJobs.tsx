import React, { useState } from 'react';
import Applications from "../../components/jobseekers/savedjobs/Applications.tsx";
import Bookmarks from "../../components/jobseekers/savedjobs/Bookmarks.tsx";
import { motion, AnimatePresence } from 'framer-motion';

type TabSwitcherProps = {
  targetTab: string;
  currentTab: string;
  onClick: () => void;
};

const TabSwitcher = ({ targetTab, currentTab, onClick }: TabSwitcherProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 relative text-center py-2 font-medium ${currentTab==targetTab?'text-red-500':'text-gray-600'} hover:text-red-500`}
    >
      {targetTab === "applications" ? "Job Applications" : "Bookmarked Jobs"}
      {currentTab === targetTab && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
          layoutId="activeTabIndicator"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

const MyJobs = () => {
  const [currentTab, setCurrentTab] = useState("applications");

  return (
    <div className="flex flex-col p-8 mt-4 items-center">
      <div className="flex border-b border-gray-300 w-full max-w-md relative">
        <TabSwitcher
          targetTab="applications"
          currentTab={currentTab}
          onClick={() => setCurrentTab("applications")}
        />
        <TabSwitcher
          targetTab="bookmarks"
          currentTab={currentTab}
          onClick={() => setCurrentTab("bookmarks")}
        />
      </div>

      <div className="w-full max-w-md min-h-[400px] mb-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: currentTab === "applications" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentTab === "applications" ? 20 : -20 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4"
          >
            {currentTab === "applications" ? (
              <Applications/>
            ) : (
              <Bookmarks/>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyJobs;
