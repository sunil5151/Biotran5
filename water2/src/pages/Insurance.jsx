import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, UploadCloud } from "lucide-react";
import Sidebar from "../components/Sidebar";

const inputVariants = {
  focus: { scale: 0.98 },
  blur: { scale: 1 },
};

export default function Insurance() {
  const [documents, setDocuments] = useState({
    insurancePolicy: null,
    medicalRecords: null,
    identityProof: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prevDocs) => ({
      ...prevDocs,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploaded Documents:", documents);
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Insurance Documents</h2>
          <div className="grid grid-cols-1 gap-6">
            <FileUploadField
              icon={<FileText />}
              name="insurancePolicy"
              label="Insurance Policy Document"
              onChange={handleFileChange}
              file={documents.insurancePolicy}
            />
            <FileUploadField
              icon={<FileText />}
              name="medicalRecords"
              label="Medical Records"
              onChange={handleFileChange}
              file={documents.medicalRecords}
            />
            <FileUploadField
              icon={<FileText />}
              name="identityProof"
              label="Identity Proof"
              onChange={handleFileChange}
              file={documents.identityProof}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Submit Documents
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function FileUploadField({ icon, name, label, onChange, file }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center justify-between p-3 border border-gray-300 rounded-md shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
          <span className="text-gray-700 text-sm">{file ? file.name : "No file chosen"}</span>
        </div>
        <input type="file" name={name} onChange={onChange} className="hidden" id={name} />
        <label htmlFor={name} className="cursor-pointer bg-indigo-600 text-white py-1 px-3 rounded-md flex items-center space-x-1">
          <UploadCloud className="h-4 w-4" />
          <span>Upload</span>
        </label>
      </div>
    </div>
  );
}
