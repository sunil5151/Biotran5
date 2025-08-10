

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // Use a function to get the initial state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to light mode if nothing is saved
    return savedTheme === 'dark';
  });

  // Effect to apply the theme class to the HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};