import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { User, Mail, Star, LogIn } from "lucide-react";
import devi from "./devi.png"; 
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      // If not authenticated, stop fetching and show the login prompt below.
      if (!token || !isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:4000/api/doctor/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [token, isAuthenticated]);

  const handleDoctorClick = (doctorEmail) => {
    if (!isAuthenticated) {
      toast.error("Please login to view doctor details");
      navigate('/login');
      return;
    }
    navigate(`/doctor/${doctorEmail}`);
  };

  // If not authenticated, show a login prompt
  if (!isAuthenticated) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <LogIn className="mx-auto w-16 h-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view our doctors and book appointments
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.email}
              onClick={() => handleDoctorClick(doctor.email)}
              className="group bg-white rounded-xl shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:brightness-95"
            >
              {/* Image Section */}
              <div className="relative bg-blue-100 h-[200px] rounded-t-xl flex items-center justify-center overflow-hidden">
                <img
                  src={
                    doctor.image && doctor.image.base64
                      ? `data:${doctor.image.mimeType};base64,${doctor.image.base64}`
                      : devi
                  }
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:-translate-y-2 group-hover:brightness-90"
                />
              </div>
  
              {/* Content Section */}
              <div className="p-6">
                {/* Availability Badge */}
                <div className="flex items-center justify-center mb-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center ${
                      doctor.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      doctor.available ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </div>
  
                {/* Doctor Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{doctor.speciality}</p>
                </div>
  
                {/* Rating Stars */}
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className="text-yellow-400 h-5 w-5 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
