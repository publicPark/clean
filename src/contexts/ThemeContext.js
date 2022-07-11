import { useState, createContext, useContext } from "react";

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

const storedTheme = window.localStorage.getItem('theme');
let initialState = true
let initialLang = 'ko'

if (storedTheme) {
  if (storedTheme === "true") initialState = true
  else if(storedTheme==="false") initialState = false
}

const storedLang = window.localStorage.getItem('lang');
let sysLang = 'ko';
if(navigator.language != null) sysLang = navigator.language; 
sysLang = sysLang.toLowerCase().substring(0.2); // 저장된 언어 값을 0부터 2까지 자르고 소문자로 변환하여 lang에 저장
if(sysLang==='en') initialLang = 'en'

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(initialState)
  const [lang, setLang] = useState(initialLang)

  function toggleTheme() {
    window.localStorage.setItem('theme', !darkTheme);
    setDarkTheme(prevDarkTheme => !prevDarkTheme)
  }
  
  function changeLang(val) {
    window.localStorage.setItem('lang', val);
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