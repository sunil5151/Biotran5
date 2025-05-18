import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignedPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedPatients = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          'http://localhost:4000/api/doctor/patients/assigned',
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setPatients(response.data.patients);
        }
      } catch (err) {
        console.error('Error fetching assigned patients:', err);
        setError(err.response?.data?.message || 'Failed to load assigned patients');
        toast.error('Failed to load assigned patients');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">My Assigned Patients</h3>
      {patients.length === 0 ? (
        <p className="text-gray-500">No patients assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {patients.map((patient) => (
            <div 
              key={patient.email}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                <h4 className="font-medium text-lg">{patient.name}</h4>
                <p className="text-gray-600">{patient.email}</p>
              </div>
              {patient.medicalRecord ? (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Medical Record</h5>
                  <iframe
                    src={patient.medicalRecord}
                    title={`Medical record for ${patient.name}`}
                    className="w-full h-96 border border-gray-200 rounded"
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic">No medical record available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedPatients;