import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Toaster from './components/Global/Toaster';

import Layout from './layouts/Layout';
import ProtectedRoute from './components/Global/ProtectedRoute';
import CustomCursor from './components/Global/CustomCursor';
import SplashScreen from './components/Global/SplashScreen';
import NotificationPopup from './components/Global/NotificationPopup';

const Home = lazy(() => import('./pages/Home'));
const Academics = lazy(() => import('./pages/Academics'));
const StudentLife = lazy(() => import('./pages/StudentLife'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const Faculty = lazy(() => import('./pages/Faculty'));
const InformationPage = lazy(() => import('./pages/InformationPage'));
const MandatoryDisclosure = lazy(() => import('./pages/MandatoryDisclosure'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
import AdminLayout from './pages/admin/AdminLayout';
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManagePrincipal = lazy(() => import('./pages/admin/ManagePrincipal'));
const ManageFaculty = lazy(() => import('./pages/admin/ManageFaculty'));
const ManageResults = lazy(() => import('./pages/admin/ManageResults'));
const ManagePages = lazy(() => import('./pages/admin/ManagePages'));
const ManageNotices = lazy(() => import('./pages/admin/ManageNotices'));
const ManagePopups = lazy(() => import('./pages/admin/ManagePopups'));
const ManageCalendar = lazy(() => import('./pages/admin/ManageCalendar'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageEnquiries = lazy(() => import('./pages/admin/ManageEnquiries'));
const ManageSettings = lazy(() => import('./pages/admin/ManageSettings'));
const Clubs = lazy(() => import('./pages/Clubs'));
const ManageClubs = lazy(() => import('./pages/admin/ManageClubs'));

function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <NotificationPopup />
      <CustomCursor />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Suspense fallback={<div className="min-h-screen grid place-items-center text-primary">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<InformationPage pageKey="about" />} />
            <Route path="infrastructure" element={<InformationPage pageKey="infrastructure" />} />
            <Route path="academics" element={<Academics />} />
            <Route path="cca" element={<InformationPage pageKey="cca" />} />
            <Route path="achievements" element={<InformationPage pageKey="achievements" />} />
            <Route path="hpd" element={<InformationPage pageKey="hpd" />} />
            <Route path="student-life" element={<StudentLife />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="recruitment" element={<InformationPage pageKey="recruitment" />} />
            <Route path="admission" element={<Admissions />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="enquiry" element={<Enquiry />} />
            <Route path="contact" element={<Enquiry />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="mandatory-disclosure" element={<MandatoryDisclosure />} />
            <Route path="disclosure" element={<MandatoryDisclosure />} />
            <Route path="clubs" element={<Clubs />} />
          </Route>

          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="principal" element={<ManagePrincipal />} />
            <Route path="faculty" element={<ManageFaculty />} />
            <Route path="results" element={<ManageResults />} />
            <Route path="pages" element={<ManagePages />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="popups" element={<ManagePopups />} />
            <Route path="calendar" element={<ManageCalendar />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="clubs" element={<ManageClubs />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
