import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FileText, UploadCloud, Image } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { AppContext } from '../context/AppContext'; 
import { toast } from 'react-hot-toast';

export default function Document() {
  const { user } = useContext(AppContext); 

  const [formData, setFormData] = useState({
    photo: null,
    prescription: null,
    medicalReport: null,
    insurance: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(`File selected for ${name}:`, files[0]); // Debugging
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debugging

    if (!user) {
      console.error("User context not available");
      toast.error("User not logged in");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', user.email);
      console.log("User email added:", user.email); // Debugging

      Object.entries(formData).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
          console.log(`Appending file: ${key}`, file.name); // Debugging
        }
      });

      const response = await axios.put(
        'http://localhost:4000/api/user/update-documents', 
        formDataToSend, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Response received:", response.data); // Debugging

      if (response.data.success) {
        toast.success('Documents uploaded successfully');
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || 'Error uploading documents');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Documents</h2>
          
          <FileUpload label="Upload Your Photo" name="photo" icon={<Image />} onChange={handleFileChange} />
          <FileUpload label="Prescription" name="prescription" icon={<FileText />} onChange={handleFileChange} />
          <FileUpload label="Medical Report" name="medicalReport" icon={<FileText />} onChange={handleFileChange} />
          <FileUpload label="Insurance Policy" name="insurance" icon={<FileText />} onChange={handleFileChange} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Submit
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function FileUpload({ label, name, icon, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center gap-2 border rounded-md p-3">
        {icon}
        <input
          type="file"
          name={name}
          accept="image/*,.pdf,.doc,.docx"
          onChange={onChange}
          className="w-full text-gray-700 file:border-none file:bg-gray-100 file:px-3 file:py-1 file:rounded-md"
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-indigo-700"
        >
          <UploadCloud size={16} /> Upload
        </motion.button>
      </div>
    </div>
  );
}
