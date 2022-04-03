import React from 'react';
import './index.css';
import App from './components/App';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App tab="home" />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);