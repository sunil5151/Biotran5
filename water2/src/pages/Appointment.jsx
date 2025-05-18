import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctor';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);

  const fetchDocInfo = () => {
    if (doctors && doctors.length > 0) {
      const docInfo = doctors.find((doc) => doc._id === docId);
      setDocInfo(docInfo);
      if (docInfo) {
        getAvailableSlots(docInfo);
      }
    }
  };

  const getAvailableSlots = (docInfo) => {
    if (!docInfo || !docInfo.slots_booked) {
      console.error('Doctor information or slots_booked is missing');
      return;
    }
    // Your logic to get available slots
    console.log(docInfo.slots_booked);
  };

  useEffect(() => {
    if (doctors) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  if (!docInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="relative bg-blue-100 h-32 md:h-auto md:w-1/3 rounded-t-lg md:rounded-t-none md:rounded-l-lg overflow-hidden">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-full h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 md:w-2/3">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {docInfo.name}
            <span className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </h1>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${docInfo.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
            <span className="text-sm font-semibold text-gray-700">
              {docInfo.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-1">Speciality: {docInfo.speciality}</p>
          <p className="text-sm text-gray-600 mb-2">
            Experience: {docInfo.experience} Years
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Appointment fee: <span className="font-bold">${docInfo.fee}</span>
          </p>

          <div className="mt-2">
            <h2 className="text-sm font-medium text-gray-800">About</h2>
            <p className="text-xs text-gray-600 mt-1">
              {docInfo.about || 'No details provided.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <RelatedDoctors speciality={docInfo.speciality} docId={docInfo._id} />
      </div>
    </div>
  );
};

export default Appointment;
