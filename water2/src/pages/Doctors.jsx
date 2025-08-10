import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { User, Mail, Star, LogIn } from "lucide-react";
import devi from "./devi.png";
import config from "../config/config";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Doctors = ({ darkMode }) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.apiUrl}/api/doctor/all`, {
          headers: { Authorization: `Bearer ${token}` },
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
      navigate("/login");
      return;
    }
    navigate(`/doctor/${doctorEmail}`);
  };

  if (!isAuthenticated) {
    return (
      <div
        className="pt-20 pb-12 min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        <div
          className="max-w-md mx-auto px-4 text-center rounded-xl shadow-lg p-8"
          style={{
            backgroundColor: "var(--card-background)",
            color: "var(--text-color)",
          }}
        >
          <LogIn className="mx-auto w-16 h-16 text-[var(--primary-color)] mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Authentication Required
          </h2>
          <p className="mb-6">
            Please login to view our doctors and book appointments
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-light-color)] transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="flex-1 max-w-7xl mx-auto px-4 pt-20 pb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            Our Doctors
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl shadow-lg p-6"
                style={{ backgroundColor: "var(--card-background)" }}
              >
                <Skeleton
                  circle
                  width={120}
                  height={120}
                  baseColor={darkMode ? "#374151" : "#E5E7EB"}
                  highlightColor={darkMode ? "#4b5563" : "#F3F4F6"}
                />
                <div className="mt-4 text-center">
                  <Skeleton
                    height={24}
                    width={150}
                    className="mb-2"
                    baseColor={darkMode ? "#374151" : "#E5E7EB"}
                    highlightColor={darkMode ? "#4b5563" : "#F3F4F6"}
                  />
                  <Skeleton
                    height={20}
                    width={100}
                    baseColor={darkMode ? "#374151" : "#E5E7EB"}
                    highlightColor={darkMode ? "#4b5563" : "#F3F4F6"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-20 pb-8 min-h-screen"
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.email}
              onClick={() => handleDoctorClick(doctor.email)}
              className="group rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl"
              style={{ backgroundColor: "var(--card-background)" }}
            >
              {/* Image Section */}
              <div className="doctor-image-container">
                <img
                  src={
                    doctor.image && doctor.image.base64
                      ? `data:${doctor.image.mimeType};base64,${doctor.image.base64}`
                      : devi
                  }
                  alt={doctor.name}
                  className="doctor-image transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              </div>

              {/* Content Section */}
              <div className="p-6 text-center">
                {/* Availability Badge */}
                <div className="flex items-center justify-center mb-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center`}
                    style={{
                      backgroundColor: doctor.available
                        ? "var(--secondary-color)"
                        : "var(--accent-color)",
                      color: "white",
                    }}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2`}
                      style={{
                        backgroundColor: "white",
                      }}
                    ></span>
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="mb-4">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {doctor.name}
                  </h3>
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--primary-color)" }}
                  >
                    {doctor.speciality}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-current"
                      style={{ color: "#FCD34D" }}
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
