// /src/components/DoctorDropdown.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function DoctorDropdown() {
  // Get logged-in user info from AppContext
  const { user, setUser } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch list of doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/doctor/all");
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // When a doctor is selected, assign the logged-in user to that doctor
  const handleDoctorSelect = async (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    if (!doctorId) return; // If no doctor is selected, do nothing

    try {
      // Make an API call to assign the doctor for the current user.
      // We send both the doctorId and the user's _id (from context)
      const response = await axios.post(
        "http://localhost:4000/api/user/assign-doctor",
        { doctorId, userId: user._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update the global context with the new user data
        setUser(response.data.updatedPatient);
        toast.success("Doctor assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning doctor:", error);
      toast.error("Failed to assign doctor");
    }
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div>
      <h2>Select Your Doctor</h2>
      <select value={selectedDoctor} onChange={handleDoctorSelect}>
        <option value="">-- Select a Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name} ({doc.speciality})
          </option>
        ))}
      </select>
    </div>
  );
}
