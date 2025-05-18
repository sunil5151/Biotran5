import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import { FcGoogle } from "react-icons/fc";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AppContext);
  const [isDoctor, setIsDoctor] = useState(false); // false = Patient, true = Doctor
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
      // Choose endpoint based on the toggle state
      const endpoint = isDoctor 
        ? 'http://localhost:4000/api/doctor/login'
        : 'http://localhost:4000/api/user/login';

      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success && response.data.token) {
        // Store token
        localStorage.setItem('jwtToken', response.data.token);

        // Set default Authorization header for future requests
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        
        {/* Toggle buttons for patient and doctor */}
        <div className="mb-4 flex justify-center">
          <button 
            onClick={() => handleToggle("patient")}
            className={`px-4 py-2 border ${!isDoctor ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-l focus:outline-none`}
          >
            Patient
          </button>
          <button 
            onClick={() => handleToggle("doctor")}
            className={`px-4 py-2 border ${isDoctor ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-r focus:outline-none`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
              disabled={loading}
              aria-label="Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
              disabled={loading}
              aria-label="Password"
            />
          </div>

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
            <label htmlFor="rememberMe" className="text-gray-600">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
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

        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>

        <div className="mt-4">
          <button
            className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center"
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
