import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PatientAccessManagement = () => {
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthorizedDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:4000/api/user/authorized-doctors');
      
      if (response.data.success) {
        setAuthorizedDoctors(response.data.authorizedDoctors);
      }
    } catch (error) {
      console.error('Error fetching authorized doctors:', error);
      setError('Failed to load authorized doctors');
      toast.error('Failed to load authorized doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (doctorEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/revoke-doctor-access', { 
        doctorEmail 
      });
      
      if (response.data.success) {
        // Update local state
        setAuthorizedDoctors(authorizedDoctors.filter(
          doctor => doctor.email !== doctorEmail
        ));
        
        toast.success('Doctor access revoked successfully');
      }
    } catch (error) {
      console.error('Error revoking doctor access:', error);
      toast.error('Failed to revoke doctor access');
    }
  };

  useEffect(() => {
    fetchAuthorizedDoctors();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Authorized Doctors</h2>
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Authorized Doctors</h2>
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Authorized Doctors</h2>
      <p className="text-gray-600 mb-4">
        These doctors currently have access to your medical data.
      </p>
      
      {authorizedDoctors.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No doctors have been granted access</p>
      ) : (
        <div className="space-y-4">
          {authorizedDoctors.map((doctor, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-gray-500">
                  Access granted on: {new Date(doctor.grantedDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRevokeAccess(doctor.email)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Revoke Access
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAccessManagement;