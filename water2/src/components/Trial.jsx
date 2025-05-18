import React from "react";

function Trial() {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <a href="#" className="text-2xl font-bold text-blue-600">
            Doctor Booking
          </a>
          <ul className="flex space-x-6 text-gray-600">
            <li>
              <a href="#features" className="hover:text-blue-600">
                Features
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-blue-600">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-600">
                Contact
              </a>
            </li>
            <li>
              <a
                href="#download"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-50">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center p-6">
          <div className="text-center md:text-left md:w-1/2 space-y-4">
            <h1 className="text-4xl font-extrabold text-blue-600">
              Book Appointments Easily
            </h1>
            <p className="text-lg text-gray-700">
              Simplify your healthcare journey with our easy-to-use doctor
              booking app.
            </p>
            <a
              href="#download"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://via.placeholder.com/400"
              alt="Doctor Booking Illustration"
              className="w-full max-w-sm mx-auto animate-fadeIn"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-blue-50 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-blue-600">Search Doctors</h3>
              <p className="mt-2 text-gray-600">
                Find specialists and general practitioners near you.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-blue-600">
                Schedule Appointments
              </h3>
              <p className="mt-2 text-gray-600">
                Book appointments instantly with just a few taps.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-blue-600">
                View Medical History
              </h3>
              <p className="mt-2 text-gray-600">
                Access and share your health records securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">
                "This app makes booking appointments so easy!"
              </p>
              <h4 className="mt-4 font-bold text-blue-600">- John Doe</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">
                "I love how seamless the experience is."
              </p>
              <h4 className="mt-4 font-bold text-blue-600">- Jane Smith</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">
                "A must-have app for anyone seeking healthcare."
              </p>
              <h4 className="mt-4 font-bold text-blue-600">- Michael Lee</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center space-y-4">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <p>Email: support@doctorbookingapp.com | Phone: (123) 456-7890</p>
          <p>&copy; 2025 Doctor Booking App. All rights reserved.</p>
        </div>
      </footer>

      {/* Animation */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 1.5s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Trial;
