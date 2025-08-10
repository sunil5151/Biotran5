

import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = ({ darkMode }) => {
  return (
    <div
      id="speciality-section"
      className="mt-16 p-8 shadow-md rounded-lg text-center"
      style={{ backgroundColor: 'var(--card-background)', color: 'var(--text-color)' }}
    >
      <h1 className="text-4xl font-bold mb-4">Find by Speciality</h1>
      <p className="text-lg text-gray-500 mb-8" style={{ color: 'var(--text-color)' }}>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      {/* Speciality Icons */}
      <div className="flex flex-wrap justify-center gap-8">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center group transition-transform duration-300 transform hover:-translate-y-2"
            style={{ scrollMarginTop: '80px' }}
          >
            {/* Icon with hover effect */}
            <div className="p-4 rounded-full transition-colors duration-300 group-hover:bg-blue-100 dark:group-hover:bg-gray-700">
              <img
                src={item.image}
                alt={item.speciality}
                className="w-20 h-20"
              />
            </div>
            {/* Speciality name */}
            <p className="text-sm font-medium mt-2 group-hover:text-blue-600 transition-colors duration-300">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;