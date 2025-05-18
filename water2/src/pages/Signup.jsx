import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [isDoctor, setIsDoctor] = useState(false); // false = Patient, true = Doctor
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = () => {
    setIsDoctor(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);

    // Only append the image if signing up as a patient
    if (image) {
      submitData.append('image', image);
    }

    // Choose endpoint based on toggle
    const endpoint = isDoctor 
      ? 'http://localhost:4000/api/doctor/signup' 
      : 'http://localhost:4000/api/user/signup';

    try {
      const response = await axios.post(endpoint, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('jwtToken', response.data.token);
        }
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        {/* Toggle Button */}
        <div className="mb-6 flex items-center justify-center">
          <button
            onClick={handleToggle}
            className="px-4 py-2 border rounded-l focus:outline-none"
            style={{ backgroundColor: !isDoctor ? '#3b82f6' : 'white', color: !isDoctor ? 'white' : '#3b82f6' }}
          >
            Patient
          </button>
          <button
            onClick={handleToggle}
            className="px-4 py-2 border rounded-r focus:outline-none"
            style={{ backgroundColor: isDoctor ? '#3b82f6' : 'white', color: isDoctor ? 'white' : '#3b82f6' }}
          >
            Doctor
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Only show file input if the user is signing up as a patient */}
          {(
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
