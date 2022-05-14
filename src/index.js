import React from 'react';
import { useLayoutEffect } from 'react'
import './index.css';
import App from './components/App';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter, HashRouter, useLocation } from "react-router-dom";
const container = document.getElementById('root');
const root = createRoot(container);

const Wrapper = ({children}) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children
} 

root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <HashRouter> */}
      <Wrapper>
        <ThemeProvider>
          <App tab="home" />
        </ThemeProvider>
      </Wrapper>
      {/* </HashRouter> */}
    </BrowserRouter>
  </React.StrictMode>
);