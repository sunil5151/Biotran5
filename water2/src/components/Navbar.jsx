import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout, isDoctor } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center">
            <img
              src={assets.logoo}
              alt="Logo"
              className="h-10 w-auto mr-2 transition duration-300 hover:scale-110"
            />
          </NavLink>
        </div>

        {/* Navbar Links */}
        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-4 text-lg font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition duration-300 ${
                  isActive ? 'text-white font-bold' : ''
                }`
              }
            >
              <li className="p-2 rounded-md hover:bg-gray-700 transition duration-300">
                Home
              </li>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition duration-300 ${
                  isActive ? 'text-white font-bold' : ''
                }`
              }
            >
              <li className="p-2 rounded-md hover:bg-gray-700 transition duration-300">
                About
              </li>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition duration-300 ${
                  isActive ? 'text-white font-bold' : ''
                }`
              }
            >
              <li className="p-2 rounded-md hover:bg-gray-700 transition duration-300">
                Contact
              </li>
            </NavLink>
                      {!user?.isDoctor && (
        <NavLink
          to="/doctor-access"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white transition duration-300 ${
              isActive ? 'text-white font-bold' : ''
            }`
          }
        >
          <li className="p-2 rounded-md hover:bg-gray-700 transition duration-300">
            Doctor Access
          </li>
        </NavLink>
      )}
            {/* Only show Doctors link if user is NOT a doctor */}
            {!isDoctor && (
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  `text-gray-300 hover:text-white transition duration-300 ${
                    isActive ? 'text-white font-bold' : ''
                  }`
                }
              >
                <li className="p-2 rounded-md hover:bg-gray-700 transition duration-300">
                  Doctors
                </li>
              </NavLink>
            )}
          </ul>
        </div>

        {/* User Profile & Dropdown */}
        <div className="relative">
          {user ? (
            <div className="flex items-center space-x-4">
              <img
                src={
                  user?.image?.mimeType && user?.image?.base64
                    ? `data:${user.image.mimeType};base64,${user.image.base64}`
                    : assets.profile_pic
                }
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="relative">
                <img
                  src={assets.dropdown_icon}
                  alt="Dropdown"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    <div
                      className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate('/my-profile')}
                    >
                      My Profile
                    </div>
                    <div
                      className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate('/my-appointments')}
                    >
                      My Appointments
                    </div>
                    <div
                      className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;