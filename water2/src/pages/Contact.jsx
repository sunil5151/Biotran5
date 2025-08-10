

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { assets } from '../assets/assets';

const Contact = ({ darkMode }) => {
  return (
    <div 
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-16"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16">
          CONTACT <span className="text-blue-600">US</span>
        </h1>

        {/* Main Content Container */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row transition-colors duration-300"
          style={{ backgroundColor: 'var(--card-background)' }}
        >
          {/* Image Section */}
          <div className="lg:w-1/2">
            <img
              src={assets.contact_image}
              alt="Healthcare professional with patient"
              className="w-full h-96 md:h-[500px] lg:h-full object-cover transition-transform duration-300 transform hover:scale-105"
            />
          </div>

          {/* Contact Information Section */}
          <div 
            className="lg:w-1/2 p-8 md:p-12"
          >
            <div className="space-y-12">
              {/* Office Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">OUR OFFICE</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p>00000 Willms Station</p>
                      <p>Suite 000, Washington, USA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <p>Tel: (000) 000-0000</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <p>Email: greatstackdev@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Careers Section */}
              <div 
                className="pt-8 border-t"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <h2 className="text-2xl font-bold mb-4">CAREERS AT PRESCRIPTO</h2>
                <p className="mb-6" style={{ color: 'var(--text-color)' }}>
                  Learn more about our teams and job openings.
                </p>
                <button className="inline-flex items-center px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300">
                  Explore Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;