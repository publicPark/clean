import { useState, createContext, useContext, useEffect } from "react";

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const storedTheme = window.localStorage.getItem('theme');
  let initialState = true
  if (storedTheme) {
    if (storedTheme === "true") initialState = true
    else if(storedTheme==="false") initialState = false
  }

  const [darkTheme, setDarkTheme] = useState(initialState)

  function toggleTheme() {
    window.localStorage.setItem('theme', !darkTheme);
    setDarkTheme(prevDarkTheme => !prevDarkTheme)
  }
  
  const value = {
    darkTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}