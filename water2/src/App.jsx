

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "./context/AppContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx"; // <-- Corrected import path

// Import your components and pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Login";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PatientDashboard from "./pages/Dashboard";
import ChatList from "./pages/ChatList";
import ChatScreen from "./pages/ChatScreen";
import DoctorListPage from "./pages/DoctorListPage";
import DoctorPatients from "./pages/DoctorPatients";
import AddDoctor from "./pages/AddDoctor";
import Address from "./pages/Address";
import Medical from "./pages/Medical";
import Document from "./pages/Document";
import Insurance from "./pages/Insurance";
import ShowData from "./pages/ShowData";
import Appointment from "./pages/Appointment";
import AdminDashboard from "./pages/Admin";
import DoctorAccess from "./pages/Dashboard1";
import SpecialityMenu from './components/SpecialityMenu';
import TopDoctors from './components/TopDoctors';
import Header from './components/Header';
import Banner from './components/Banner';

const AppContent = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const showSidebar = [
    '/my-profile',
    '/my-profile/dashboard',
    '/my-profile/address',
    '/my-profile/medical',
    '/my-profile/documents',
    '/my-profile/insurance',
    '/dashboard',
    '/doctor-patients',
    '/admin/dashboard'
  ].includes(location.pathname);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Navbar />
      <div className="flex flex-1 pt-16">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 overflow-auto ${showSidebar ? '' : 'p-6'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctor-access" element={<DoctorAccess />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-list" element={<DoctorListPage />} />
            <Route path="/doctor/:email" element={<DoctorDetail />} />
            <Route path="/doctor-detail" element={<DoctorDetail />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/get-doctor" element={<DoctorAccess />} />
            <Route path="/doctor-patients" element={<DoctorPatients />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-profile/dashboard" element={<MyProfile />} />
            <Route path="/my-profile/address" element={<Address />} />
            <Route path="/my-profile/medical" element={<Medical />} />
            <Route path="/my-profile/documents" element={<Document />} />
            <Route path="/my-profile/insurance" element={<Insurance />} />
            <Route path="/show-data" element={<ShowData />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-profile" element={<PatientDashboard />} />
            <Route path="/dashboard" element={<DoctorAccess />} />
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/chat/:receiverEmail" element={<ChatScreen />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

const App = () => (
  <AppContextProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AppContextProvider>
);

export default App;