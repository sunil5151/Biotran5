

import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import { FcGoogle } from "react-icons/fc";
import { AppContext } from "../context/AppContext";
import config from '../config/config';

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const { login } = useContext(AppContext);
  const [isDoctor, setIsDoctor] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (role) => {
    setIsDoctor(role === "doctor");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isDoctor 
        ? `${config.apiUrl}/api/doctor/login`
        : `${config.apiUrl}/api/user/login`;

      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        if (isDoctor) {
          login(response.data.doctor, response.data.token, true);
        } else {
          login(response.data.user, response.data.token, false);
        }

        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
    toast.info("Google Sign In functionality not implemented yet");
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen py-16 px-4"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div 
        className="shadow-lg rounded-xl p-8 w-full max-w-md transition-colors duration-300"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>
        
        {/* Toggle buttons for patient and doctor */}
        <div 
          className="mb-6 flex justify-center p-1 rounded-xl shadow-inner"
          style={{ backgroundColor: 'var(--background-color)' }}
        >
          <button 
            onClick={() => handleToggle("patient")}
            className={`flex-1 px-4 py-2 text-center rounded-lg font-medium transition-all duration-300 ${!isDoctor 
              ? 'bg-[var(--primary-color)] text-white shadow' 
              : 'text-[var(--text-color)] hover:bg-transparent'}`}
            style={{ 
              backgroundColor: !isDoctor ? 'var(--primary-color)' : '',
              color: !isDoctor ? 'white' : 'var(--text-color)'
            }}
          >
            Patient
          </button>
          <button 
            onClick={() => handleToggle("doctor")}
            className={`flex-1 px-4 py-2 text-center rounded-lg font-medium transition-all duration-300 ${isDoctor 
              ? 'bg-[var(--primary-color)] text-white shadow' 
              : 'text-[var(--text-color)] hover:bg-transparent'}`}
            style={{ 
              backgroundColor: isDoctor ? 'var(--primary-color)' : '',
              color: isDoctor ? 'white' : 'var(--text-color)'
            }}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              style={{ 
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--background-color)'
              }}
              placeholder="Enter your email"
              required
              disabled={loading}
              aria-label="Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              style={{ 
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--background-color)'
              }}
              placeholder="Enter your password"
              required
              disabled={loading}
              aria-label="Password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
                disabled={loading}
                aria-label="Remember Me"
              />
              <label htmlFor="rememberMe" className="text-gray-500">
                Remember Me
              </label>
            </div>
            <a href="#" className="text-[var(--primary-color)] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[var(--primary-color)] text-white py-3 px-4 rounded-lg font-bold hover:bg-[var(--primary-light-color)] transition duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Login"
          >
            {loading ? (
              <ReactLoading type="spin" color="#ffffff" height={24} width={24} className="mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-[var(--primary-color)] hover:underline">
            Sign up
          </a>
        </p>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span 
              className="bg-[var(--card-background)] px-2 text-gray-500"
            >
              Or
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 flex items-center justify-center font-medium shadow-sm"
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
          >
            <FcGoogle className="mr-2" size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Login;