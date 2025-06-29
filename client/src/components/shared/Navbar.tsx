import React from "react";
import {FaArrowRight, FaBars, FaHouse, FaSuitcase, FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authentication/useAuth.ts";

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const { user, logout} = useAuth();
    const navigate = useNavigate();
;

    const tabs = {
      Admin :[
        { name: "Users Dashboard", path: "/admin" },
        { name: "Pending Jobs", path: "/admin/pending-jobs" }
      ],
      JobSeeker: [
        { name: "Home", path: "/" },
        { name: "Employers", path: "/employers" },
        { name: "My Jobs", path: "/my-jobs" }
      ],
      Employer: [
        { name: "Employers Dashboard", path: "/employer-dashboard" }
      ]
    }
    const handleLogout  = async () => {
        await logout();
        setOpen(false);
        navigate("/login");
    }


    return (
      <nav
        className="sticky z-10 bg-black top-0 w-[90%] flex mx-auto  justify-between gap-4   border-red-100 border-b  p-4">

        <ul className="flex  text-md space-x-12 text-white max-md:hidden">
          <li><a href="#">Job<span
            className="text-red-500 under">Sync </span></a></li>
          {tabs[user?.role]?.map((tab) => (
            <li><Link to={tab.path}> {tab.name}</Link></li>
          ))}
        </ul>

        <div className="flex max-md:hidden   gap-6  items-center">
          <div className="cursor-pointer text-white  text-lg">
            {(!user ?
              (<Link to="/login">Login</Link>) : (
                <button type="button" onClick={handleLogout} className="cursor-pointer text-white">
                  Logout
                </button>))}
          </div>

          <Link className=" text-white p-1 text-2xl rounded-lg hover:text-red-500 hover:bg-red-300 cursor-pointer "
                to='/profile'>
            <FaUser/>
          </Link>
        </div>

        <div className="w-full flex items-center justify-between py-4 px-4 text-white md:hidden">
          <p className="text-lg font-semibold">
            <a href="#" className="hover:text-red-500 transition-colors">
              Job<span className="text-red-500">Sync</span>
            </a>
          </p>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Toggle menu"
            >
              <FaBars className="text-xl"/>
            </button>

            <div
              className={`absolute top-12 right-0 w-48 rounded-lg bg-black border border-gray-50 py-2 px-4 z-50 transition-all duration-200 ${
                open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <ul className="flex flex-col space-y-3">
                {tabs[user?.role]?.map((tab, index) => (
                  <li key={index} className="border-b border-gray-700 last:border-0">
                    <Link
                      to={tab.path}
                      className="block py-2 px-2 text-sm text-white hover:text-red-500 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {tab.name}
                    </Link>
                  </li>
                ))}

                <li className="border-b border-gray-700 last:border-0">
                  {!user ? (
                    <Link
                      to="/login"
                      className="block py-2 px-2 text-sm text-white hover:text-red-500 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full text-left py-2 px-2 text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

      </nav>
    );
};

export default Navbar;
