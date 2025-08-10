
import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout, isDoctor } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    setShowMenu(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`shadow-lg fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center" onClick={handleLinkClick}>
            <img
              src={assets.logoo}
              alt="Prescripto Logo"
              className="h-10 w-auto transition duration-300 hover:scale-110"
            />
          </NavLink>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-8 text-lg font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition duration-300 ${
                  isActive 
                    ? `${darkMode ? 'text-white font-bold' : 'text-blue-600 font-bold'}` 
                    : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium transition duration-300 ${
                  isActive 
                    ? `${darkMode ? 'text-white font-bold' : 'text-blue-600 font-bold'}` 
                    : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-medium transition duration-300 ${
                  isActive 
                    ? `${darkMode ? 'text-white font-bold' : 'text-blue-600 font-bold'}` 
                    : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                }`
              }
            >
              Contact
            </NavLink>
            {/* Conditional Links */}
            {!user?.isDoctor && (
              <NavLink
                to="/doctor-access"
                className={({ isActive }) =>
                  `font-medium transition duration-300 ${
                    isActive 
                      ? `${darkMode ? 'text-white font-bold' : 'text-blue-600 font-bold'}` 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                  }`
                }
              >
                Doctor Access
              </NavLink>
            )}
            {!isDoctor && (
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  `font-medium transition duration-300 ${
                    isActive 
                      ? `${darkMode ? 'text-white font-bold' : 'text-blue-600 font-bold'}` 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                  }`
                }
              >
                Doctors
              </NavLink>
            )}
          </ul>
        </div>

        {/* User Profile & Dropdown / Auth Button */}
        <div className="relative flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-colors duration-300 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hidden md:block"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <img src={assets.menu_icon} alt="Menu" className="h-6 w-6" />
            </button>
          </div>

          {user ? (
            <>
              <div className="relative hidden md:block">
                <img
                  src={
                    user?.image?.mimeType && user?.image?.base64
                      ? `data:${user.image.mimeType};base64,${user.image.base64}`
                      : assets.profile_pic
                  }
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-blue-500"
                  onClick={() => setShowMenu(!showMenu)}
                />
                
                {showMenu && (
                  <div
                    className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-20"
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    <NavLink
                      to="/my-profile"
                      onClick={handleLinkClick}
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-appointments"
                      onClick={handleLinkClick}
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      My Appointments
                    </NavLink>
                    <hr className="my-2 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 font-medium hidden md:block"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-100 dark:bg-gray-800 px-4 pt-2 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <NavLink to="/" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Home</NavLink>
          <NavLink to="/about" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">About</NavLink>
          <NavLink to="/contact" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Contact</NavLink>
          {!user?.isDoctor && (
            <NavLink to="/doctor-access" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Doctor Access</NavLink>
          )}
          {!isDoctor && (
            <NavLink to="/doctors" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Doctors</NavLink>
          )}
          {user ? (
            <>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <NavLink to="/my-profile" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">My Profile</NavLink>
              <NavLink to="/my-appointments" onClick={handleLinkClick} className="block px-4 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">My Appointments</NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;