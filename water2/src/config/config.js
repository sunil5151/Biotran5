// Environment variables for API endpoints
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Export configuration
const config = {
  apiUrl: BACKEND_URL,
  socketUrl: BACKEND_URL, // Socket.IO uses the same server
};

export default config;