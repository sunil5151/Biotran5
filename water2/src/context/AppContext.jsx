import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { doctors as doctorsData } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // Use the same key "jwtToken" here
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
  const [doctors, setDoctors] = useState(doctorsData);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserData(storedToken);
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserData = async (storedToken) => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      if (response.data.success) {
        const fetchedUser = response.data.user;
        // Add any additional properties to the user as needed
        setUser(fetchedUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401 && error.response.data?.isExpired) {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token, isDoctorFlag = false) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
    setIsDoctor(isDoctorFlag);
    // Use the same key "jwtToken" here
    localStorage.setItem('jwtToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsDoctor(false);
    setIsAuthenticated(false);
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Axios interceptor for token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const value = { 
    doctors,
    setDoctors,
    user,
    setUser,
    isAuthenticated,
    token,
    isDoctor,
    login: handleLogin,
    logout: handleLogout,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;