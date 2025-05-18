import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 rounded-lg">
      <div className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 py-4 px-3 md:px- animate-gradient bg-[length:400%_400%] rounded-lg shadow-md ">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Side */}
          <div className="text-white text-center md:text-left">
            <div>
              <p className="text-3xl font-semibold mb-2">Book Appointment</p>
              <p className="text-xl">With 100+ Trusted Doctors</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-500 font-bold py-2 px-6 rounded-full mt-4 hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </div>

          {/* Right Side */}
          <div className="mt-8 md:mt-0">
            <img
              src={assets.appointment_img}
              alt="Doctor illustration"
              className="max-w-xs rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
