

import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header = ({ darkMode }) => {
  const { isAuthenticated } = useContext(AppContext);
  const location = useLocation();

  if (location.pathname.startsWith('/chat')) {
    return null;
  }
  
  return (
    <div 
      className="max-w-7xl mx-auto pt-28 pb-12 px-6"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side - Text and Button */}
        <div className="flex-1 text-center md:text-left">
          <p 
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: 'var(--text-color)' }}
          >
            Book Appointment with <br/>Trusted Doctors
          </p>
          <p 
            className="text-lg md:text-xl mb-6 font-light"
            style={{ color: 'var(--text-color)' }}
          >
            Simple browsing through our extensive list of trusted doctors.
          </p>
          
          {isAuthenticated && (
            <Link 
              to="/chats"
              className="mt-4 inline-flex items-center justify-center px-6 py-3 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              <span className="tracking-wide">Chat with Doctors</span>
            </Link>
          )}

          <a
            href="#speciality-section"
            className="mt-6 inline-flex items-center justify-center p-3 font-medium text-white rounded-lg shadow-lg bg-gradient-to-br from-[var(--secondary-color)] to-[var(--primary-color)] hover:from-[var(--secondary-light-color)] hover:to-[var(--primary-light-color)] transition-all duration-300 transform hover:-translate-y-1 ml-4"
          >
            Book Appointment
          </a>
        </div>

        {/* Right Side - Image */}
        <div className="flex-shrink-0 mt-8 md:mt-0">
          <img 
            src={assets.header_img} 
            alt="Header" 
            className="w-full md:w-80 lg:w-96 rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;