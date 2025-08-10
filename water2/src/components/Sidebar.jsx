
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  MapPin,
  Stethoscope,
  Calendar,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import React from "react";
import { AppContext } from "../context/AppContext";
import { assets } from '../assets/assets';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SidebarButton = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-x-3 rounded-xl p-4 text-left transition-all",
        "bg-gray-700 hover:bg-gray-600 active:scale-[0.98]",
        isActive ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-300"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600 transition-colors",
          "group-hover:bg-gray-500",
          isActive ? "bg-blue-700 group-hover:bg-blue-800" : ""
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
      </div>
    </button>
  );
};

export default function Sidebar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDoctor, logout } = useContext(AppContext);

  const patientLinks = [
    { id: "dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { id: "profile", icon: <User className="h-5 w-5" />, label: "My Profile", path: "/my-profile" },
    { id: "appointments", icon: <Calendar className="h-5 w-5" />, label: "My Appointments", path: "/my-appointments" },
    { id: "doctors", icon: <Stethoscope className="h-5 w-5" />, label: "Find Doctors", path: "/doctors" },
  ];

  const doctorLinks = [
    { id: "dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { id: "profile", icon: <User className="h-5 w-5" />, label: "My Profile", path: "/my-profile" },
    { id: "patients", icon: <User className="h-5 w-5" />, label: "Assigned Patients", path: "/doctor-patients" },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linksToShow = isDoctor ? doctorLinks : patientLinks;

  return (
    <div 
      className="hidden md:flex h-screen flex-col w-64 gap-y-6 border-r p-6 transition-colors duration-300" 
      style={{
        backgroundColor: '#1f2937', // Fixed dark color
        borderColor: '#4b5563', // Fixed dark color
        color: '#e5e7eb' // Fixed dark color
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Medical Portal</h2>
      </div>

      <div className="h-px" style={{ backgroundColor: '#4b5563' }} />

      <nav className="flex-1 space-y-2">
        {linksToShow.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
            }}
          />
        ))}
      </nav>

      <div className="h-px" style={{ backgroundColor: '#4b5563' }} />

      <div 
        className="rounded-xl p-4"
        style={{
          backgroundColor: '#374151',
          borderColor: '#4b5563'
        }}
      >
        <p className="text-sm">
          Need help? Contact support at{" "}
          <a href="mailto:support@medical.com" className="text-blue-500 hover:underline">
            support@medical.com
          </a>
        </p>
      </div>

      <div className="h-px" style={{ backgroundColor: '#4b5563' }} />
      
      <div className="flex flex-col gap-y-2">
        
        <SidebarButton
          icon={<LogOut className="h-5 w-5 text-red-400" />}
          label="Logout"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}