

import React from 'react';
import { Clock, MapPin, UserCheck } from 'lucide-react';
import { assets } from '../assets/assets';

const About = ({ darkMode }) => {
  return (
    <div 
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            ABOUT <span className="text-blue-600">US</span>
          </h1>
          <p className="text-lg text-gray-500" style={{ color: 'var(--text-color)' }}>
            Your trusted partner in managing your healthcare needs.
          </p>
        </div>
        
        {/* Main Content: Image and Text */}
        <div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-16 rounded-xl shadow-lg p-8"
          style={{ backgroundColor: 'var(--card-background)' }}
        >
          <img
            src={assets.about_image} // Assuming you have a more fitting 'about_image'
            alt="Medical professionals"
            className="rounded-lg shadow-xl w-full h-80 md:h-96 lg:h-full object-cover transition-transform duration-300 transform hover:scale-105"
          />
          <div className="text-left">
            <p className="mb-6">
              Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <h2 className="text-3xl font-bold text-center mb-12">WHY CHOOSE US</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Efficiency Card */}
          <div 
            className="p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <div className="flex justify-center mb-4">
              <Clock className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">EFFICIENCY</h3>
            <p className="text-gray-500 text-center" style={{ color: 'var(--text-color)' }}>
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          {/* Convenience Card */}
          <div 
            className="p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <div className="flex justify-center mb-4">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">CONVENIENCE</h3>
            <p className="text-gray-500 text-center" style={{ color: 'var(--text-color)' }}>
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          {/* Personalization Card */}
          <div 
            className="p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <div className="flex justify-center mb-4">
              <UserCheck className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">PERSONALIZATION</h3>
            <p className="text-gray-500 text-center" style={{ color: 'var(--text-color)' }}>
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;