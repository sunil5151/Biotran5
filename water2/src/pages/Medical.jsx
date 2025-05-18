import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Star, AlertCircle, CheckCircle, X } from "lucide-react";
import devi from "./devi.png"; 
export default function DoctorSelection() {
  const { user, setUser, token } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  
  // Default doctor placeholder image if none is provided
  const defaultDoctorImage = "/api/placeholder/400/320";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        toast.info("Loading doctors, please wait...", {
          position: "top-right",
          autoClose: 3000
        });
        
        const response = await axios.get("http://localhost:4000/api/doctor/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
          toast.success(`${response.data.doctors.length} doctors loaded successfully!`, {
            position: "top-right",
            autoClose: 3000
          });
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [token]);

  const handleDoctorSelect = async (e) => {
    const doctorEmail = e.target.value;
    setSelectedDoctor(doctorEmail);
  
    if (!doctorEmail) {
      toast.warning("Please select a doctor");
      return;
    }
  
    if (!user || !user.email) {
      toast.error("Please login to assign a doctor");
      navigate("/login");
      return;
    }
  
    try {
      const selectedDoc = doctors.find(doc => doc.email === doctorEmail);
      
      if (!selectedDoc) {
        toast.error("Selected doctor not found");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/doctor/assign",
        { 
          userEmail: user.email,
          doctorEmail: doctorEmail
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        setUser({
          ...user,
          doctorAssigned: {
            name: selectedDoc.name,
            email: selectedDoc.email
          }
        });
        toast.success("Doctor assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning doctor:", error);
      toast.error(error.response?.data?.message || "Failed to assign doctor");
    }
  };
  
  const confirmDoctorSelection = async (doctorEmail) => {
    try {
      const selectedDoc = doctors.find(doc => doc.email === doctorEmail);
      
      if (!selectedDoc) {
        toast.error("Selected doctor not found", {
          position: "top-right"
        });
        return;
      }

      toast.info("Assigning doctor...", {
        position: "top-right",
        autoClose: 2000
      });

      const response = await axios.post(
        "http://localhost:4000/api/doctor/assign",
        { 
          userEmail: user.email,
          doctorEmail: doctorEmail
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        setUser({
          ...user,
          doctorAssigned: {
            name: selectedDoc.name,
            email: selectedDoc.email
          }
        });
        toast.success("Doctor assigned successfully!", {
          icon: <CheckCircle className="text-green-500" />,
          position: "top-right",
          autoClose: 5000
        });
        
        // After short delay, show another success toast
        setTimeout(() => {
          toast.info("You can now schedule appointments with your doctor", {
            position: "bottom-right",
            autoClose: 5000
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error assigning doctor:", error);
      toast.error(error.response?.data?.message || "Failed to assign doctor", {
        position: "top-right",
        autoClose: 5000
      });
    }
  };

  const viewDoctorProfile = (doctorEmail) => {
    if (doctorEmail) {
      const url = `/doctor/${doctorEmail}`;
      console.log("Navigating to:", url);
      navigate(url);
    } else {
      console.error("Doctor email is missing!");
      toast.error("Could not view doctor profile", {
        position: "top-right"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading doctors...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch available doctors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-3">My Healthcare Profile</h2>
          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Personal Information</h3>
                  <p className="text-gray-700 flex items-center mb-3">
                    <span className="font-medium w-24">Name:</span> 
                    <span className="bg-white px-3 py-1 rounded-lg flex-grow">{user.name}</span>
                  </p>
                  <p className="text-gray-700 flex items-center mb-3">
                    <span className="font-medium w-24">Email:</span> 
                    <span className="bg-white px-3 py-1 rounded-lg flex-grow">{user.email}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Current Doctor</h3>
                {user.doctorAssigned ? (
  <div className="flex flex-col items-center">
    <div className="w-24 h-24 rounded-full bg-blue-100 mb-3 overflow-hidden">
      <img 
        src={(() => {
          const assignedDoctor = doctors.find(doc => doc.email === user.doctorAssigned.email);
          if (assignedDoctor?.image?.base64) {
            return `data:${assignedDoctor.image.mimeType};base64,${assignedDoctor.image.base64}`;
          }
          return defaultDoctorImage;
        })()}
        alt={user.doctorAssigned.name} 
        className="w-full h-full object-cover"
      />
    </div>
    <p className="text-xl font-bold text-blue-800">{user.doctorAssigned.name}</p>
    <p className="text-gray-600 italic">{user.doctorAssigned.email}</p>
    
    <button
      onClick={() => viewDoctorProfile(user.doctorAssigned.email)}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      View Profile & Schedule
    </button>
  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <p className="text-gray-600 mb-4">No doctor currently assigned</p>
                    <p className="text-blue-600 font-medium">Please select a doctor from the options below</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-6 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-red-500 mr-3" />
                <p className="text-red-600 text-lg font-medium">User data not available. Please log in.</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Selection Grid */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold text-blue-800">Select Your Doctor</h2>
              <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                {doctors.length} Available Doctors
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.email}
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
                      <p className="text-lg text-blue-600 font-medium">{doctor.speciality || "General Practitioner"}</p>
                    </div>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center justify-center space-x-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="text-yellow-400 h-5 w-5 fill-current"
                        />
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                    <button
  value={doctor.email}
  onClick={handleDoctorSelect}
  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Select Doctor
</button>
                      <button 
                        onClick={() => viewDoctorProfile(doctor.email)}
                        className="w-full py-2 bg-gray-100 text-blue-600 font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}