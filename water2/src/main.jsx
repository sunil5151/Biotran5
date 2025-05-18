import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Import your styles
import AppContextProvider from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AppContextProvider>
    <AuthProvider>
    <App />
  </AuthProvider>
    </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
