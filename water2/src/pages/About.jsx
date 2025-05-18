import React from 'react';
import { Clock, MapPin, UserCheck } from 'lucide-react';
import { assets } from '../assets/assets';
function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ABOUT <span className="text-blue-600">US</span>
        </h1>
        
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <img
              src={assets.appointment_img}
              alt="Medical professionals"
              className="rounded-lg shadow-xl w-full h-[1000px] object-cover md:w-[400px] md:h-auto"
            />
            <div className="text-left">
              <p className="text-gray-600 mb-6">
                Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-12">WHY CHOOSE US</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Efficiency Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl">
            <div className="flex justify-center mb-4">
              <Clock className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">EFFICIENCY</h3>
            <p className="text-gray-600">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          {/* Convenience Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl">
            <div className="flex justify-center mb-4">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">CONVENIENCE</h3>
            <p className="text-gray-600">
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          {/* Personalization Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl">
            <div className="flex justify-center mb-4">
              <UserCheck className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">PERSONALIZATION</h3>
            <p className="text-gray-600">
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;