

import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="max-w-7xl mx-auto px-6"
    >
      <div 
        className={`py-12 px-8 rounded-2xl shadow-xl transition-colors duration-300`}
        style={{ backgroundColor: 'var(--card-background)', color: 'var(--text-color)' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side - Text and Button */}
          <div className="flex-1 text-center md:text-left">
            <div>
              <p className="text-4xl font-bold mb-2 md:text-5xl">Book Appointment</p>
              <p className="text-xl md:text-2xl font-light">With 100+ Trusted Doctors</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full mt-6 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="flex-shrink-0">
            <img
              src={assets.appointment_img}
              alt="Doctor illustration"
              className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-2xl transition-transform duration-300 transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;