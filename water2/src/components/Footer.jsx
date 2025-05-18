import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-10 w-auto transition duration-300 hover:scale-110"
            />
            <p className="text-blue-900 text-xl font-bold">Prescripto</p>
          </div>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle Section */}
        <div>
          <p className="text-black text-lg font-bold mb-4">COMPANY</p>
          <ul className="list-none space-y-2 text-gray-600">
            <li className="hover:text-black cursor-pointer transition">Home</li>
            <li className="hover:text-black cursor-pointer transition">About us</li>
            <li className="hover:text-black cursor-pointer transition">Delivery</li>
            <li className="hover:text-black cursor-pointer transition">Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-black text-lg font-bold mb-4">GET IN TOUCH</p>
          <ul className="list-none space-y-2 text-gray-600">
            <li className="hover:text-black cursor-pointer transition">+1-212-456-7890</li>
            <li className="hover:text-black cursor-pointer transition">greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-6 text-center">
        <p className="text-gray-600 text-sm">
          Copyright © 2024 @ Prescripto.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
