import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "./context/AppContext";
import Home from "./pages/Home";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatList from "./pages/ChatList"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard1 from "./pages/Dashboard1";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import MyProfile from "./pages/MyProfile";
import Document from "./pages/Document";
import Insurance from "./pages/Insurance";
import Medical from "./pages/Medical";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorListPage from "./pages/DoctorListPage";
import GetDoctor from "./pages/GetDoctor";
import ShowData from "./pages/ShowData";
import ChatScreen from "./pages/ChatScreen";
import MyAppointments from "./pages/MyAppointments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Address from "./pages/Address";
import PatientDashboard from "./pages/Dashboard";
import Dashboard from "./pages/Admin";
import Appointment from "./pages/Appointment";
import AddDoctor from "./pages/AddDoctor";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />   
        <div className="flex-1 flex flex-col mt-16">
          <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctor-access" element={<Dashboard1 />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/chats" element={<ChatList />} />
                <Route path="/chat/:receiverEmail" element={<ChatScreen />} />
              <Route path="/doctors/:speciality" element={<Doctors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctor-list" element={<DoctorListPage />} />
              <Route path="/doctor/:email" element={<DoctorDetail />} />
              <Route path="/doctor-detail" element={<DoctorDetail />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/get-doctor" element={<GetDoctor />} />
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
              <Route path="/dashboard" element={<Dashboard1 />} />
              <Route path="/appointment/:docId" element={<Appointment />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </AppContextProvider>
  );
};

export default App;