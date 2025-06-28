import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/jobseeker/HomePage.tsx'
import Authentication from './pages/Authentication.tsx'
import Registration from './pages/Registration.tsx'
import Employers from "./pages/jobseeker/Employers.tsx";
import ViewEmployer from "./pages/jobseeker/ViewEmployer.tsx";
import { AuthProvider } from "./context/authentication/AuthContext.tsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.tsx";
import View from "./pages/jobseeker/View.tsx";
import MyJobs from "./pages/jobseeker/MyJobs.tsx";
import Update from "./pages/jobseeker/Update.tsx";
import { ToastContainer } from "react-toastify/unstyled";
import Unauthorized from "./pages/Unauthorized.tsx";
import Dashboard from "./pages/employer/Dashboard.tsx";
import JobPosting from "./pages/employer/JobPosting.tsx";
import ApplicationDetails from "./pages/employer/ApplicationDetails.tsx";
import CreateJobForm from "./pages/employer/CreateJobForm.tsx";
import UpdateCompanyForm from "./pages/employer/UpdateCompanyForm.tsx";
import UpdateJobForm from "./pages/employer/UpdateJobForm.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ViewUser from "./pages/admin/ViewUser.tsx";
import PendingJobs from "./pages/admin/PendingJobs.tsx";
import PendingJob from "./pages/admin/PendingJob.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element:<ProtectedRoute role="JobSeeker" login={true}>
                    <HomePage />
                </ProtectedRoute>
            },
            {
                path: '/employers',
                element: (
                    <ProtectedRoute role="JobSeeker" login={true}>
                        <Employers />
                    </ProtectedRoute>
                )
            },
            {
                path: '/employers/:id',
                element: (
                    <ProtectedRoute role="JobSeeker" login={true}>
                        <ViewEmployer />
                    </ProtectedRoute>
                )
            },
            {
                path: '/profile',
                element: (
                    <ProtectedRoute role="JobSeeker" login={true}>
                        <View />
                    </ProtectedRoute>
                )
            },
            {
                path: '/profile-update',
                element:(
                    <ProtectedRoute  role="JobSeeker" login={true}>
                        <Update />
                    </ProtectedRoute>
                )
            },
            {
                path: '/my-jobs',
                element: (
                    <ProtectedRoute role="JobSeeker" login={true}>
                        <MyJobs />
                    </ProtectedRoute>
                )
            },
            {
                path: '/employer-dashboard',
                element: <ProtectedRoute login={true} role="Employer">
                    <Dashboard />
                </ProtectedRoute>
            },
          {
            path: '/employer-dashboard/jobs/:id',
            element: <ProtectedRoute login={true} role="Employer">
              <JobPosting/>
            </ProtectedRoute>
          },
          {
            path: '/employer-dashboard/jobs/:id/edit',
            element: <ProtectedRoute login={true} role="Employer">
              <UpdateJobForm/>
            </ProtectedRoute>
          },
          {
            path: '/employer-dashboard/jobs/:id/candidates/:jobSeekerId',
            element: <ProtectedRoute login={true} role="Employer">
              <ApplicationDetails/>
            </ProtectedRoute>
          },
          {
            path: '/employer-dashboard/update',
            element: <ProtectedRoute login={true} role="Employer">
              <UpdateCompanyForm/>
            </ProtectedRoute>
          },
          {
            path: '/employer-dashboard/create',
            element: <ProtectedRoute login={true} role="Employer">
              <CreateJobForm/>
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
            },
          {
            path  : '/admin',
              element:<AdminDashboard/>
          },
          {
            path  : '/admin/pending-jobs',
            element:<PendingJobs/>
          },
          {
            path :"/admin/users/:id",
            element: <ViewUser/>
          },
          {
            path: '/admin/pending-jobs/:employerId/:jobId',
            element: <PendingJob/>
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
