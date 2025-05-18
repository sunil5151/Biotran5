import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext';

const useDoctorAccess = () => {
  const { user } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all doctors
      const doctorsResponse = await axios.get('http://localhost:4000/api/doctor/all');
      
      // Fetch authorized doctors
      const authorizedResponse = await axios.get('http://localhost:4000/api/user/authorized-doctors');
      
      if (doctorsResponse.data.success && authorizedResponse.data.success) {
        const allDoctors = doctorsResponse.data.doctors;
        const authorized = authorizedResponse.data.authorizedDoctors;
        
        // Create a map of authorized doctor emails for quick lookup
        const authorizedMap = new Map();
        authorized.forEach(doc => authorizedMap.set(doc.email, true));
        
        // Add isAuthorized flag to each doctor
        const doctorsWithAuthStatus = allDoctors.map(doctor => ({
          ...doctor,
          isAuthorized: authorizedMap.has(doctor.email)
        }));
        
        setDoctors(doctorsWithAuthStatus);
        setAuthorizedDoctors(authorized);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (doctorEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/grant-doctor-access', { 
        doctorEmail 
      });
      
      if (response.data.success) {
        // Update local state
        setDoctors(doctors.map(doctor => 
          doctor.email === doctorEmail 
            ? { ...doctor, isAuthorized: true }
            : doctor
        ));
        
        // Refresh authorized doctors list
        await fetchData();
        
        toast.success('Doctor access granted successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error granting doctor access:', error);
      toast.error('Failed to grant doctor access');
      return false;
    }
  };

  const revokeAccess = async (doctorEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/revoke-doctor-access', { 
        doctorEmail 
      });
      
      if (response.data.success) {
        // Update local state
        setDoctors(doctors.map(doctor => 
          doctor.email === doctorEmail 
            ? { ...doctor, isAuthorized: false }
            : doctor
        ));
        
        // Refresh authorized doctors list
        await fetchData();
        
        toast.success('Doctor access revoked successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error revoking doctor access:', error);
      toast.error('Failed to revoke doctor access');
      return false;
    }
  };

  useEffect(() => {
    if (user && !user.isDoctor) {
      fetchData();
    }
  }, [user]);

  return {
    doctors,
    authorizedDoctors,
    loading,
    error,
    grantAccess,
    revokeAccess,
    refreshData: fetchData
  };
};

export default useDoctorAccess;