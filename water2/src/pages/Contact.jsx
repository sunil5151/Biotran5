import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { assets } from '../assets/assets';
function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-2 px-12 sm:px-6 lg:px-16">
      <div className="max-w-9xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-16">
            CONTACT <span className="text-blue-600">US</span>
          </h1>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-2">
            {/* Image Section */}
            <div>
              <img
                src={assets.header_img}
                alt="Healthcare professional with patient"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>

            {/* Contact Information Section */}
          <div className="space-y-8">
            {/* Office Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">OUR OFFICE</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-700">00000 Willms Station</p>
                    <p className="text-gray-700">Suite 000, Washington, USA</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-700">Tel: (000) 000-0000</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-700">Email: greatstackdev@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Careers Section */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CAREERS AT PRESCRIPTO</h2>
              <p className="text-gray-600 mb-6">
                Learn more about our teams and job openings.
              </p>
              <button className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-600 hover:text-white transition-colors duration-300">
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;