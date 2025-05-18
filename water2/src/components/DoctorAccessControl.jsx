import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import useDoctorAccess from '../hooks/useDoctorAccess';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorAccessControl = () => {
  const { user } = useContext(AppContext);
  const { doctors, loading, error, fetchDoctors } = useDoctorAccess();

  const handleToggleAccess = async (doctorEmail, currentStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const endpoint = currentStatus
        ? 'http://localhost:4000/api/user/revoke-doctor-access'
        : 'http://localhost:4000/api/user/grant-doctor-access';

      const response = await axios.post(
        endpoint,
        { doctorEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          currentStatus
            ? 'Doctor access revoked successfully!'
            : 'Doctor access granted successfully!'
        );
        fetchDoctors(); // Refresh the doctors list
      }
    } catch (error) {
      console.error('Error toggling access:', error);
      toast.error(error.response?.data?.message || 'Failed to update access');
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Doctor Access Control</h2>
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Doctor Access Control</h2>
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user || user.isDoctor) {
    return null; // Don't show this component for doctors or unauthenticated users
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Doctor Access Control</h2>
      <p className="text-gray-600 mb-4">
        Grant or revoke access to your medical data for doctors in our system.
      </p>
      
      {doctors.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No doctors available</p>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.speciality}</p>
              </div>
              <button
                onClick={() => handleToggleAccess(doctor.email, doctor.isAuthorized)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  doctor.isAuthorized
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {doctor.isAuthorized ? 'Revoke Access' : 'Grant Access'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAccessControl;