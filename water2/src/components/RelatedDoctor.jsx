import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { scrollTo } from '../utils/animations';
import { assets } from '../assets/assets';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {relDoc.slice(0, 5).map((doctor, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${doctor._id}`);
              scrollTo(0, 0);
            }}
            className="w-72 bg-white rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition duration-300 cursor-pointer"
          >
            <div className="relative bg-blue-100 h-48 rounded-t-lg overflow-hidden">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                ></span>
                <span className="text-lg font-semibold text-gray-700">
                  {doctor.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <p className="font-bold text-lg">{doctor.name}</p>
              <p className="text-md text-gray-600">{doctor.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;

