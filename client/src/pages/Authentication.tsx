import React, { useState } from 'react';
import { FaMailBulk } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';
import { useAuth } from "../hooks/authentication/useAuth.ts";
import { Link, useNavigate } from 'react-router-dom';
import { Authorize } from "../services/authentication/Authorize.ts";

const AuthenticationPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const { login, user } = useAuth();
    const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
            if (user) throw new Error("User already logged in");

            const res = await Authorize({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe
            });
        console.log(res);
        if (!res) {
                setError( "Login failed");
                setLoading(false);
                return;
            }
          const loginRes = await login(res.data, formData.rememberMe);
            setLoading(false);
            if (loginRes.role === "JobSeeker") {
                navigate('/');
            }
            else if (loginRes.role === "Employer") {
                navigate('/employer-dashboard');
            } else if (loginRes.role === "Admin") {
                navigate('/admin');
            } else {
                setError("Unauthorized access");
            }

    };


    return (
        <div
                className='mx-auto w-3/4 md:w-1/3 lg:w-1/4 rounded-md mt-16 flex flex-col items-center bg-white py-12 px-6'>
                <h1 className='text-2xl font-bold text-black'>LOGIN</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className='bg-white w-full'>
                    <form action="/" onSubmit={handleLogin} className='flex p-4 gap-4 flex-col'>
                        <div className='flex p-2 bg-gray-300 items-center gap-2 rounded-md'>
                            <FaMailBulk className='text-white'/>
                            <input
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                className='bg-gray-300 outline-none w-full'
                                type="email"
                                placeholder='Email'
                                required
                            />
                        </div>
                        <div className='flex p-2 bg-gray-300 items-center gap-2 rounded-md'>
                            <FaLock className='text-white'/>
                            <input
                                onChange={handleChange}
                                name="password"
                                value={formData.password}
                                className='w-full bg-gray-300 outline-none'
                                type="password"
                                placeholder='Password'
                                required
                            />
                        </div>
                        <div className='mt-1 max-sm:flex-col max-sm:items-start flex gap-1'>
                            <input
                                onChange={handleChange}
                                type='checkbox'
                                id='rememberMe'
                                name='rememberMe'
                                checked={formData.rememberMe}
                            />
                            <label htmlFor="rememberMe">Remember Me</label>
                        </div>
                        <button
                            type="submit"
                            className='text-white h-12 text-md text-center font-medium bg-red-500 px-4 rounded-lg hover:bg-red-600 transition'
                        >
                            Login
                        </button>
                        {loading && (
                            <div className="flex justify-center">
                                <div className="rounded-full h-5 w-5 border-b-2">
                                    Logging in...
                                </div>
                            </div>
                        )}
                        <div className='relative top-6'>
                            <p>Click <span className='text-blue-600 hover:text-blue-800'>
                            <Link to="/register">here</Link>
                        </span> to register instead.</p>
                        </div>
                    </form>
                </div>
            </div>

    );
}

const Authentication = () => {
    return <AuthenticationPage/>;
}

export default Authentication;
