import { useState, createContext, useContext } from "react";
import { defaultLang, isLangSupported } from "../data/dictionaries/dictionary";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

const storedTheme = window.localStorage.getItem("theme");
let initialState = false;
let initialLang = defaultLang;

if (storedTheme) {
  if (storedTheme === "true") initialState = true;
  else if (storedTheme === "false") initialState = false;
}

const storedLang = window.localStorage.getItem("lang");
console.log("storedLang", storedLang);
if (!storedLang) {
  let sysLang = "";
  if (navigator.language != null) {
    sysLang = navigator.language.toLowerCase().substring(0.2); // 저장된 언어 값을 0부터 2까지 자르고 소문자로 변환하여 lang에 저장
  }
  if (isLangSupported(sysLang)) initialLang = sysLang;
} else {
  if (isLangSupported(storedLang)) initialLang = storedLang;
}

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(initialState);
  const [lang, setLang] = useState(initialLang);

  function toggleTheme() {
    window.localStorage.setItem("theme", !darkTheme);
    setDarkTheme((prevDarkTheme) => !prevDarkTheme);
  }

  function changeLang(val) {
    console.log("changeLang", val);
    window.localStorage.setItem("lang", val);
    setLang(val);
  }

  const value = {
    darkTheme,
    toggleTheme,
    lang,
    changeLang,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
