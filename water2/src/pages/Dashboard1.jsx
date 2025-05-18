import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Dashboard1 = () => {
  const { user: contextUser, isDoctor } = useContext(AppContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
const handleDownloadPdf = async (patientId, patientName) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.get(
      `http://localhost:4000/api/user/patient/${patientId}/pdf`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `patient_${patientName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Unable to download PDF.");
  }
};
  useEffect(() => {
    const fetchAssignedPatients = async () => {
      if (!isDoctor) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:4000/api/user/patients/assigned-to-me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setPatients(response.data.patients);
        } else {
          setError("No patients found.");
        }
      } catch (err) {
        setError("Error fetching assigned patients.");
      } finally {
        setLoading(false);
      }
    };

    if (isDoctor) {
      fetchAssignedPatients();
    }
  }, [isDoctor]);

  const handlePreviewPdf = async (patientId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:4000/api/user/patient/${patientId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPreviewPdfUrl(pdfUrl);
    } catch (err) {
      alert("Unable to preview PDF.");
    }
  };

  const handleClosePreview = () => {
    setPreviewPdfUrl(null);
  };

  if (!isDoctor) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>This page is only for doctors.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        Patients Assigned to Dr. {contextUser?.name || "Doctor"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : patients.length === 0 ? (
        <p>No patients assigned to you.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-4">
          {patients.map((patient, idx) => (
            <li key={idx}>
              <span className="font-medium">{patient.name}</span> ({patient.email})
              {patient.pdfAvailable && (
                <>
                  <button
                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => handlePreviewPdf(patient.patientId)}
                  >
                    Preview PDF
                  </button>
<button
  className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
  onClick={() => handleDownloadPdf(patient.patientId, patient.name)}
>
  Download PDF
</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* PDF Preview Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">PDF Preview</h3>
              <button
                className="text-red-500 font-bold"
                onClick={handleClosePreview}
              >
                Close
              </button>
            </div>
            <iframe
              src={previewPdfUrl}
              title="PDF Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard1;