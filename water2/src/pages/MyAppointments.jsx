import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isDoctor, user: contextUser } = useContext(AppContext);

useEffect(() => {
  const fetchAppointments = async () => {
    try {
      let url = 'http://localhost:4000/api/appointment/my-appointments';
      if (isDoctor) {
        url = 'http://localhost:4000/api/doctor/doctor-appointments';
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchAppointments();
  }
}, [token, isDoctor]);

  if (loading) {
    return <div className="text-center mt-8">Loading appointments...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment._id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">
                  Appointment with Dr. {appointment.doctorEmail}
                </h3>
                <p className="text-gray-600">
                  Patient Email: {appointment.patientEmail}
                </p>
                <p className="text-gray-600">
                  Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Time: {new Date(appointment.appointmentDate).toLocaleTimeString()}
                </p>
                <p className={`mt-2 ${
                  appointment.status === 'confirmed'
                    ? 'text-green-600'
                    : appointment.status === 'cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;