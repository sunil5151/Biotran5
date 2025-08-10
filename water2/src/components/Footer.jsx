
import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Footer = ({ darkMode }) => {
  return (
    <footer 
      className="py-10 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--card-background)',
        color: 'var(--text-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Left Section (About) */}
        <div className="flex flex-col items-start w-full md:w-1/3">
          <div className="flex items-center gap-2 mb-4">
            <img
              src={assets.logoo}
              alt="Logo"
              className="h-10 w-auto transition duration-300 hover:scale-110"
            />
            <p className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>Prescripto</p>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle Section (Company Links) */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <p className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>COMPANY</p>
          <ul className="list-none space-y-2 text-sm">
            <li><a href="#" className="hover:underline transition duration-300">Home</a></li>
            <li><a href="#" className="hover:underline transition duration-300">About us</a></li>
            <li><a href="#" className="hover:underline transition duration-300">Delivery</a></li>
            <li><a href="#" className="hover:underline transition duration-300">Privacy policy</a></li>
          </ul>
        </div>

        {/* Right Section (Contact) */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <p className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>GET IN TOUCH</p>
          <ul className="list-none space-y-2 text-sm">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 text-center" style={{ borderColor: 'var(--card-border)' }}>
        <p className="text-sm">
          Copyright © 2024 @ Prescripto.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;