// src/pages/DoctorListPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/doctor/all");
        if (response.data && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorEmail) => {
    // Navigate to the doctor detail page passing the doctor email
    navigate(`/doctor/${doctorEmail}`);
  };                                        

  if (loading) {
    return <div className="text-center mt-8">Loading doctors...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select a Doctor</h2>
      <div className="grid grid-cols-1 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.email}
            onClick={() => handleDoctorClick(doc.email)}
            className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 cursor-pointer transition"
          >
            <h3 className="text-xl font-semibold">{doc.name}</h3>
            <p className="text-gray-600">{doc.speciality}</p>
            <p className="text-gray-500 text-sm">{doc.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
