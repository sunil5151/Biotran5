import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const DoctorProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/doctor/profile/${email}`);
        
        if (response.data.success) {
          setDoctor(response.data.doctor);
        } else {
          setError("Failed to load doctor profile");
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Error loading doctor profile");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchDoctorProfile();
    } else {
      setError("Doctor email not provided");
      setLoading(false);
    }
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-700">The doctor profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0 bg-blue-600 text-white p-8 flex flex-col items-center justify-center">
            {doctor.profileImage ? (
              <img
                className="h-48 w-48 rounded-full object-cover border-4 border-white"
                src={`http://localhost:4000/${doctor.profileImage}`}
                alt={doctor.name}
              />
            ) : (
              <div className="h-48 w-48 rounded-full bg-blue-400 flex items-center justify-center text-white text-4xl font-bold">
                {doctor.name.charAt(0)}
              </div>
            )}
            <h1 className="mt-6 text-2xl font-bold">{doctor.name}</h1>
            <p className="text-blue-200">{doctor.speciality}</p>
          </div>
          
          <div className="p-8 md:p-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                <ul className="mt-2 text-gray-600">
                  <li className="flex items-center mt-2">
                    <span className="font-medium mr-2">Email:</span> {doctor.email}
                  </li>
                  <li className="flex items-center mt-2">
                    <span className="font-medium mr-2">Phone:</span> {doctor.phone || "Not provided"}
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Professional Details</h2>
                <ul className="mt-2 text-gray-600">
                  <li className="flex items-center mt-2">
                    <span className="font-medium mr-2">Speciality:</span> {doctor.speciality}
                  </li>
                  <li className="flex items-center mt-2">
                    <span className="font-medium mr-2">Experience:</span> {doctor.experience || "Not specified"} years
                  </li>
                  <li className="flex items-center mt-2">
                    <span className="font-medium mr-2">Status:</span> 
                    <span className={`px-2 py-1 rounded-full text-xs ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {doctor.available ? "Available" : "Not Available"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              <p className="mt-2 text-gray-600">
                {doctor.bio || "No biography provided."}
              </p>
            </div>
            
            {user && !user.isDoctor && (
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => navigate("/medical")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Select as My Doctor
                </button>
                <button
                  onClick={() => navigate("/my-appointments")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;