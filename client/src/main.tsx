import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import Authentication from './pages/Authentication.tsx'
import Registration from './pages/Registration.tsx'
import Employers from "./pages/Employers.tsx";
import ViewEmployer from "./pages/ViewEmployer.tsx";
import { AuthProvider } from "./context/authentication/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ViewJobSeeker from "./pages/jobseeker/ViewJobSeeker.tsx";
import MyJobs from "./pages/jobseeker/MyJobs.tsx";
import UpdateJobSeeker from "./pages/jobseeker/UpdateJobSeeker.tsx";
import { ToastContainer } from "react-toastify/unstyled";
import Unauthorized from "./pages/Unauthorized.tsx";
import EmployerDashboard from "./pages/EmployerDashboard.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element:<ProtectedRoute role="jobseeker" login={true}>
                    <HomePage />
                </ProtectedRoute>
            },
            {
                path: '/employers',
                element: (
                    <ProtectedRoute role="jobseeker" login={true}>
                        <Employers />
                    </ProtectedRoute>
                )
            },
            {
                path: '/employers/:id',
                element: (
                    <ProtectedRoute role="jobseeker" login={true}>
                        <ViewEmployer />
                    </ProtectedRoute>
                )
            },
            {
                path: '/profile',
                element: (
                    <ProtectedRoute role="jobseeker" login={true}>
                        <ViewJobSeeker />
                    </ProtectedRoute>
                )
            },
            {
                path: '/profile-update',
                element:(
                    <ProtectedRoute  role="jobseeker"login={true}>
                        <UpdateJobSeeker />
                    </ProtectedRoute>
                )
            },
            {
                path: '/my-jobs',
                element: (
                    <ProtectedRoute role="jobseeker" login={true}>
                        <MyJobs />
                    </ProtectedRoute>
                )
            },
            {
                path: '/employer-dashboard',
                element: <ProtectedRoute login={true} role="employer">
                    <EmployerDashboard />
                </ProtectedRoute>
            },
            {
                path: '/login',
                element: (
                    <ProtectedRoute  login={false}>
                        <Authentication />
                    </ProtectedRoute>
                )
            },
            {
                path: '/register',
                element: (
                    <ProtectedRoute login={false}>
                        <Registration />
                    </ProtectedRoute>

                )
            },
            {
                path : "/unauthorized",
                element:<Unauthorized/>
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <ToastContainer/>
        <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
