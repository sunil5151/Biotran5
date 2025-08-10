

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import config from '../config/config';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase as BriefcaseMedical, 
  FileCheck, 
  AlertCircle 
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const assets = {
  profile_pic: "/default-profile.png",
};

const dummyUser = {
  email: "sunil@example.com",
  name: "Sunil",
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Dashboard({ darkMode }) {
  const { user: contextUser, isDoctor } = useContext(AppContext);
  const currentUserEmail = contextUser?.email || dummyUser.email;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        if (isDoctor) {
          const doctorResponse = await axios.get(`${config.apiUrl}/api/doctor/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (doctorResponse.data.success && doctorResponse.data.doctor) {
            setUser(doctorResponse.data.doctor);
          } else {
            setError("Doctor data not found.");
          }

          const patientsResponse = await axios.get(
            `${config.apiUrl}/api/user/patients/assigned-to-me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (patientsResponse.data.success) {
            setAssignedPatients(patientsResponse.data.patients);
          } else {
            setError("No patients found.");
          }
        } else {
          const userResponse = await axios.get(`${config.apiUrl}/api/user/get-users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const fetchedUsers = userResponse.data.users;
          const currentUser = fetchedUsers.find((u) => u.email === currentUserEmail);
          if (currentUser) {
            setUser(currentUser);
            if (currentUser.documents && currentUser.documents.pdf) {
              try {
                const pdfData = currentUser.documents.pdf;
                if (typeof pdfData === 'object' && pdfData.data) {
                  const uint8Array = new Uint8Array(pdfData.data);
                  const blob = new Blob([uint8Array], { type: "application/pdf" });
                  setPdfUrl(URL.createObjectURL(blob));
                } else if (typeof pdfData === 'string') {
                  const byteCharacters = atob(pdfData);
                  const byteNumbers = new Uint8Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const blob = new Blob([byteNumbers], { type: "application/pdf" });
                  setPdfUrl(URL.createObjectURL(blob));
                }
              } catch (pdfError) {
                toast.error("Error processing PDF file");
              }
            }
          } else {
            setError("User not found in fetched data.");
          }
        }
      } catch (err) {
        setError("We're having trouble fetching your information. Please try again.");
        toast.error("Unable to load your dashboard. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserEmail, isDoctor]);

  const handleDownloadPdf = async (patientId, patientName) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${config.apiUrl}/api/user/patient/${patientId}/pdf`,
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
      toast.error("Unable to download PDF.");
    }
  };

  const handlePreviewPdf = async (patientId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${config.apiUrl}/api/user/patient/${patientId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(pdfBlob));
      setIsPdfOpen(true);
    } catch (err) {
      toast.error("Unable to preview PDF.");
    }
  };

  const handleClosePdfPreview = () => {
    setIsPdfOpen(false);
    setPdfUrl(null);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen p-4 pt-28" 
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-xl shadow-lg p-6"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--card-border)'
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <Skeleton circle width={96} height={96} baseColor={darkMode ? "var(--card-background)" : "#E5E7EB"} highlightColor={darkMode ? "var(--card-border)" : "#F3F4F6"} />
              <div className="flex-1">
                <Skeleton height={32} width={200} baseColor={darkMode ? "var(--card-background)" : "#E5E7EB"} highlightColor={darkMode ? "var(--card-border)" : "#F3F4F6"} />
                <Skeleton height={20} width={150} baseColor={darkMode ? "var(--card-background)" : "#E5E7EB"} highlightColor={darkMode ? "var(--card-border)" : "#F3F4F6"} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--card-border)'
                  }}
                >
                  <Skeleton height={24} width={150} className="mb-4" baseColor={darkMode ? "var(--card-background)" : "#E5E7EB"} highlightColor={darkMode ? "var(--card-border)" : "#F3F4F6"} />
                  <Skeleton count={3} baseColor={darkMode ? "var(--card-background)" : "#E5E7EB"} highlightColor={darkMode ? "var(--card-border)" : "#F3F4F6"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)'
        }}
      >
        <div 
          className="text-center p-8 rounded-xl shadow-lg"
          style={{ backgroundColor: 'var(--card-background)' }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p style={{ color: 'var(--text-color)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-light-color)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isDoctor && user) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 flex-grow md:pt-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold" style={{ color: 'var(--text-color)' }}>
              Doctor's Dashboard
            </h1>
            <div 
              className="rounded-xl shadow-xl overflow-hidden p-8 mb-8"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full border-4 border-[var(--primary-color)] shadow-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={
                      user?.image?.mimeType && user?.image?.base64
                      ? `data:${user.image.mimeType};base64,${user.image.base64}`
                      : assets.profile_pic
                    }
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = assets.profile_pic; }}
                  />
                </div>
                <div style={{ color: 'var(--text-color)' }}>
                  <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
                  <p className="mb-1"><span className="font-semibold">Email:</span> {user?.email}</p>
                  <p className="mb-1"><span className="font-semibold">Speciality:</span> {user?.speciality}</p>
                  <p className="mb-1"><span className="font-semibold">Degree:</span> {user?.degree}</p>
                  <p className="mb-1"><span className="font-semibold">Experience:</span> {user?.experience}</p>
                  <p className="mb-1"><span className="font-semibold">About:</span> {user?.about}</p>
                  <p className="mb-1"><span className="font-semibold">Fees:</span> ₹{user?.fees}</p>
                  <p className="mb-1"><span className="font-semibold">Address:</span> {user?.address}</p>
                  <p className="mb-1"><span className="font-semibold">Available:</span> {user?.available ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
            
            <div 
              className="rounded-xl shadow-xl p-8"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Assigned Patients</h3>
              {assignedPatients.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedPatients.map((patient, idx) => (
                    <li 
                      key={idx} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                    >
                      <div>
                        <span className="font-medium">{patient.name}</span>
                        <p className="text-sm">({patient.email})</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        {patient.pdfAvailable && (
                          <>
                            <button
                              className="px-3 py-1 text-white rounded-md text-sm hover:bg-[var(--primary-light-color)] transition-colors"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                              onClick={() => handlePreviewPdf(patient._id)}
                            >
                              Preview
                            </button>
                            <button
                              className="px-3 py-1 text-white rounded-md text-sm hover:bg-[var(--secondary-light-color)] transition-colors"
                              style={{ backgroundColor: 'var(--secondary-color)' }}
                              onClick={() => handleDownloadPdf(patient._id, patient.name)}
                            >
                              Download
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic" style={{ color: 'var(--text-color)' }}>No patients assigned to you.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Patient Dashboard
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="rounded-xl shadow-xl overflow-hidden"
            style={{ backgroundColor: 'var(--card-background)' }}
            variants={fadeIn}
          >
            <div 
              className="relative overflow-hidden p-6 sm:p-8"
              style={{ backgroundColor: 'var(--header-background)' }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 relative">
                <div className="w-32 h-32 rounded-full border-4 border-[var(--primary-color)] shadow-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={
                      user?.image?.mimeType && user?.image?.base64
                        ? `data:${user.image.mimeType};base64,${user.image.base64}`
                        : assets.profile_pic
                    }
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = assets.profile_pic; }}
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold" style={{ color: 'var(--header-text)' }}>{user?.name}</h2>
                  <p style={{ color: 'var(--header-text)' }}>{user?.email}</p>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
                      Welcome back! Here's your latest medical information.
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              <motion.div 
                className="rounded-xl border shadow-sm p-6 transform transition duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--card-border)'
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Basic Information</h3>
                </div>
                
                <div className="space-y-3">
                  <p style={{ color: 'var(--text-color)' }}>
                    <span className="font-medium">Name:</span> {user?.name || "N/A"}
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
                    <span className="font-medium">Blood Group:</span>
                    {user?.bloodGroup ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}>
                        {user.bloodGroup}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Not recorded</span>
                    )}
                  </p>
                  <p style={{ color: 'var(--text-color)' }}>
                    <span className="font-medium">Age:</span> {user?.age || "N/A"}
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--card-border)' }}>
                  <p className="font-medium mb-2">Assigned Doctor</p>
                  {user?.doctorAssigned?.name ? (
                    <div>
                      <p style={{ color: 'var(--text-color)' }}>
                        <span className="font-medium">Name:</span> {user.doctorAssigned.name}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                        <span className="font-medium">Email:</span> {user.doctorAssigned.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No doctor assigned</p>
                  )}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  className="rounded-xl border shadow-sm p-6 transform transition duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--card-border)'
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Contact Details</h3>
                  </div>
                  <div className="space-y-3">
                    <p style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">Email:</span> {user?.email || "N/A"}
                    </p>
                    <p style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">Phone:</span> {user?.phone || "N/A"}
                    </p>
                    <p className="flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">Emergency:</span>
                      {user?.emergencyContact ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-light-color)', color: 'white' }}>
                          {user.emergencyContact}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="rounded-xl border shadow-sm p-6 transform transition duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--card-border)'
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-light-color)' }}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Address</h3>
                  </div>
                  <div className="space-y-3">
                    <p style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">City:</span> {user?.city || "N/A"}
                    </p>
                    <p style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">State:</span> {user?.state || "N/A"}
                    </p>
                    <p style={{ color: 'var(--text-color)' }}>
                      <span className="font-medium">Country:</span> {user?.country || "N/A"}
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="col-span-full rounded-xl border shadow-lg p-6 transform transition duration-200 hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--card-border)'
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-600">
                    <BriefcaseMedical className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Medical Documents</h3>
                </div>
                <div className="space-y-4">
                  {pdfUrl && (
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--background-color)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5" style={{ color: 'var(--secondary-color)' }} />
                        <span className="font-medium">Medical Records PDF</span>
                      </div>
                      <button
                        onClick={() => setIsPdfOpen(true)}
                        className="px-4 py-2 text-white rounded-lg hover:bg-[var(--primary-light-color)] transition-colors"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        aria-label="View medical records"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {user?.documents?.prescription?.fileName && (
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--background-color)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5" style={{ color: 'var(--secondary-color)' }} />
                        <span className="font-medium">Prescription</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.prescription.url, "_blank")}
                        className="px-4 py-2 text-white rounded-lg hover:bg-[var(--primary-light-color)] transition-colors"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        aria-label="View prescription"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {user?.documents?.medicalReport?.fileName && (
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--background-color)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5" style={{ color: 'var(--secondary-color)' }} />
                        <span className="font-medium">Medical Report</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.medicalReport.url, "_blank")}
                        className="px-4 py-2 text-white rounded-lg hover:bg-[var(--primary-light-color)] transition-colors"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        aria-label="View medical report"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {user?.documents?.insurance?.fileName && (
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--background-color)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5" style={{ color: 'var(--secondary-color)' }} />
                        <span className="font-medium">Insurance Policy</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.insurance.url, "_blank")}
                        className="px-4 py-2 text-white rounded-lg hover:bg-[var(--primary-light-color)] transition-colors"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        aria-label="View insurance policy"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {(!pdfUrl && !user?.documents?.prescription?.fileName && 
                    !user?.documents?.medicalReport?.fileName &&
                    !user?.documents?.insurance?.fileName) && (
                    <p className="italic text-center p-4" style={{ color: 'var(--text-color)' }}>
                      No medical documents available
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {isPdfOpen && pdfUrl && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div 
              className="p-6 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>Medical Records PDF</h3>
                <button
                  onClick={handleClosePdfPreview}
                  className="bg-[var(--accent-color)] hover:bg-[var(--accent-light-color)] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
              <iframe 
                src={pdfUrl} 
                className="flex-grow w-full border-0 rounded-lg"
                title="Medical Records PDF"
              ></iframe>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}