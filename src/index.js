import React from 'react';
import './index.css';
import App from './components/App';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter } from "react-router-dom";
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ThemeProvider>
        <AuthProvider>
          <App tab="home" />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);