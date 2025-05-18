import React, { useState } from 'react';
import usePatientData from '../hooks/usePatientData';

const PatientDetailView = ({ patientEmail }) => {
  const { 
    patient, 
    loading, 
    hasAccess, 
    pdfUrl, 
    error 
  } = usePatientData(patientEmail);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-center py-6">
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Access Required</h3>
            <p>You don't have permission to view this patient's full data.</p>
            <p className="mt-2 text-sm">The patient needs to grant you access from their home page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-500 py-4">Patient data not available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          {/* PDF Preview Button */}
          {pdfUrl ? (
            <button
              onClick={() => setIsPdfOpen(true)}
              className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              View Medical Records PDF
            </button>
          ) : (
            <p className="mt-4 text-gray-500 italic mb-4">No medical records PDF available</p>
          )}
          
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Name:</span> {patient.name || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {patient.email || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Blood Group:</span>
              {patient.bloodGroup ? (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {patient.bloodGroup}
                </span>
              ) : (
                <span className="text-gray-500 italic">Not recorded</span>
              )}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Age:</span> {patient.age || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Gender:</span> {patient.gender || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date of Birth:</span> {patient.dob || "N/A"}
            </p>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h3>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {patient.phone || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Emergency Contact:</span>
              {patient.emergencyContact ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {patient.emergencyContact}
                </span>
              ) : (
                <span className="text-gray-500 italic">Not provided</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">City:</span> {patient.city || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">State:</span> {patient.state || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Country:</span> {patient.country || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Postal Code:</span> {patient.postalCode || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Permanent Address:</span> {patient.permanentAddress || "N/A"}
            </p>
          </div>
        </div>
        
        {/* Medical Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Allergies:</span> {patient.allergies || "None"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Vaccination History:</span> {patient.vaccinationHistory || "None"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Health Insurance Policy:</span> {patient.healthInsurancePolicy || "None"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Display PDF in an iframe modal */}
      {isPdfOpen && pdfUrl && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Medical Records</h3>
              <button
                onClick={() => setIsPdfOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
            <iframe 
              src={pdfUrl} 
              className="w-full h-full border-0"
              title="Medical Records PDF"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetailView;