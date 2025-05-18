import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const usePatientData = (patientEmail) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if doctor has access
      const accessResponse = await axios.get(
        `http://localhost:4000/api/doctor/check-patient-access/${patientEmail}`
      );
      
      setHasAccess(accessResponse.data.hasAccess);
      
      if (accessResponse.data.hasAccess) {
        // If has access, fetch full patient data
        const patientResponse = await axios.get(
          `http://localhost:4000/api/doctor/patient/${patientEmail}`
        );
        
        if (patientResponse.data.success) {
          setPatient(patientResponse.data.patient);
          
          // Handle PDF if available
          if (patientResponse.data.patient.documents?.pdf) {
            try {
              const pdfData = patientResponse.data.patient.documents.pdf;
              
              // Create a blob from the PDF data
              const uint8Array = new Uint8Array(pdfData.data);
              const blob = new Blob([uint8Array], { type: "application/pdf" });
              const pdfBlobUrl = URL.createObjectURL(blob);
              
              setPdfUrl(pdfBlobUrl);
            } catch (pdfError) {
              console.error("Error processing PDF:", pdfError);
              setError("Error processing PDF file");
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('Failed to load patient data');
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientEmail) {
      fetchPatientData();
    }
    
    // Cleanup function to revoke object URLs
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [patientEmail]);

  return {
    patient,
    loading,
    hasAccess,
    pdfUrl,
    error,
    refreshData: fetchPatientData
  };
};

export default usePatientData;