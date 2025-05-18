import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Skeleton from "react-loading-skeleton";
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

// Import AppContext (ensure you have created this context and wrap your app with its provider)
import { AppContext } from "../context/AppContext";

// Import assets (missing in your code)
const assets = {
  profile_pic: "/default-profile.png", // Add a default profile picture path here
};

// Fallback dummy user for development if context isn't ready
const dummyUser = {
  email: "sunil@example.com",
  name: "Sunil",
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function PatientDashboard() {
  const { user: contextUser } = useContext(AppContext);
  const currentUserEmail = contextUser?.email || dummyUser.email;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    hasUserData: false,
    hasPdfData: false,
    pdfDataType: null,
    pdfDataLength: null,
    conversionError: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for email:", currentUserEmail);
        const response = await axios.get("http://localhost:4000/api/user/get-users");
        console.log("API response:", response.data);
        
        const fetchedUsers = response.data.users;
        console.log("Number of users fetched:", fetchedUsers?.length || 0);
        
        const currentUser = fetchedUsers.find((u) => u.email === currentUserEmail);
        console.log("Current user found:", !!currentUser);
        
        if (currentUser) {
          setUser(currentUser);
          setDebugInfo(prev => ({...prev, hasUserData: true}));
          
          console.log("User documents:", currentUser.documents);
          
          if (currentUser.documents && currentUser.documents.pdf) {
            console.log("PDF data found in user documents");
            setDebugInfo(prev => ({
              ...prev, 
              hasPdfData: true,
              pdfDataType: typeof currentUser.documents.pdf
            }));
            
            try {
              // Handle the case when PDF comes as an object with Buffer data
              if (typeof currentUser.documents.pdf === 'object' && currentUser.documents.pdf.data) {
                console.log("PDF is in Buffer format with data array");
                
                // Create a Uint8Array from the Buffer data array
                const uint8Array = new Uint8Array(currentUser.documents.pdf.data);
                
                // Create a blob from the Uint8Array
                const blob = new Blob([uint8Array], { type: "application/pdf" });
                const pdfBlobUrl = URL.createObjectURL(blob);
                
                console.log("Created PDF blob URL from Buffer data:", pdfBlobUrl);
                setPdfUrl(pdfBlobUrl);
                toast.success("PDF loaded successfully");
                
                setDebugInfo(prev => ({
                  ...prev,
                  pdfDataLength: currentUser.documents.pdf.data.length,
                  conversionMethod: "Buffer object with data array"
                }));
              } 
              // Handle the case when PDF is a base64 string
              else if (typeof currentUser.documents.pdf === 'string') {
                console.log("PDF is a base64 string");
                const base64Data = currentUser.documents.pdf;
                
                try {
                  const byteCharacters = atob(base64Data);
                  const byteNumbers = new Uint8Array(byteCharacters.length);
                  
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  
                  const blob = new Blob([byteNumbers], { type: "application/pdf" });
                  const pdfBlobUrl = URL.createObjectURL(blob);
                  
                  console.log("Created PDF blob URL from base64:", pdfBlobUrl);
                  setPdfUrl(pdfBlobUrl);
                  toast.success("PDF loaded successfully");
                  
                  setDebugInfo(prev => ({
                    ...prev,
                    pdfDataLength: base64Data.length,
                    conversionMethod: "Base64 string"
                  }));
                } catch (base64Error) {
                  console.error("Error converting base64 to PDF:", base64Error);
                  setDebugInfo(prev => ({...prev, conversionError: base64Error.message}));
                  toast.error("Failed to decode base64 PDF data");
                }
              } else {
                console.error("PDF data is in an unsupported format:", typeof currentUser.documents.pdf);
                toast.warning("PDF data found but in unsupported format");
              }
            } catch (pdfError) {
              console.error("Error processing PDF:", pdfError);
              setDebugInfo(prev => ({...prev, conversionError: pdfError.message}));
              toast.error("Error processing PDF file");
            }
          } else {
            console.log("No PDF data found in user documents");
          }
        } else {
          console.error("User not found in fetched data");
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("We're having trouble fetching your information. Please try again.");
        toast.error("Unable to load your dashboard. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [currentUserEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton circle width={96} height={96} />
              <div className="flex-1">
                <Skeleton height={32} width={200} />
                <Skeleton height={20} width={150} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton height={24} width={150} className="mb-4" />
                  <Skeleton count={3} />
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8 flex-grow"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          {/* Debug Information (visible during development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <h3 className="font-bold text-yellow-800 mb-2">Debug Information:</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          
          <motion.div 
            className="bg-white rounded-xl shadow-xl overflow-hidden"
            variants={fadeIn}
          >
            {/* Header Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
              <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={
                      user?.image?.mimeType && user?.image?.base64
                        ? `data:${user.image.mimeType};base64,${user.image.base64}`
                        : assets.profile_pic
                    }
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading profile image");
                      e.target.src = assets.profile_pic;
                    }}
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{user?.name}</h2>
                  <p className="text-blue-100">{user?.email}</p>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                      Welcome back! Here's your latest medical information.
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <motion.div 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                </div>
                
                {/* PDF Preview Button */}
                {pdfUrl ? (
                  <button
                    onClick={() => setIsPdfOpen(true)}
                    className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Medical Records PDF
                  </button>
                ) : (
                  <p className="mt-4 text-gray-500 italic">No medical records PDF available</p>
                )}

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
                
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {user?.name || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Blood Group:</span>
                    {user?.bloodGroup ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {user.bloodGroup}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Not recorded</span>
                    )}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Age:</span> {user?.age || "N/A"}
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Assigned Doctor</p>
                    {user?.doctorAssigned?.name ? (
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Name:</span> {user.doctorAssigned.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Email:</span> {user.doctorAssigned.email}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No doctor assigned</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Contact Details */}
              <motion.div 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Contact Details</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user?.email || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {user?.phone || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Emergency Contact:</span>
                    {user?.emergencyContact ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {user.emergencyContact}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* Address Information */}
              <motion.div 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Address Information</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">City:</span> {user?.city || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">State:</span> {user?.state || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Country:</span> {user?.country || "N/A"}
                  </p>
                </div>
              </motion.div>

              {/* Medical Documents */}
              <motion.div 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BriefcaseMedical className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Medical Documents</h3>
                </div>
                <div className="space-y-4">
                  {user?.documents?.prescription?.fileName ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Prescription</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.prescription.url, "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label="View prescription"
                      >
                        View
                      </button>
                    </div>
                  ) : null}
                  {user?.documents?.medicalReport?.fileName ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Medical Report</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.medicalReport.url, "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label="View medical report"
                      >
                        View
                      </button>
                    </div>
                  ) : null}
                  {user?.documents?.insurance?.fileName ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Insurance Policy</span>
                      </div>
                      <button
                        onClick={() => window.open(user.documents.insurance.url, "_blank")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label="View insurance policy"
                      >
                        View
                      </button>
                    </div>
                  ) : null}
                  {(!user?.documents?.prescription?.fileName && 
                    !user?.documents?.medicalReport?.fileName &&
                    !user?.documents?.insurance?.fileName) && (
                    <p className="text-gray-500 italic text-center p-4">
                      No additional documents available
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}