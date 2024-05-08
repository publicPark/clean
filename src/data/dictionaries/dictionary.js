import { en } from "./en.js";
import { ko } from "./ko.js";

export const langList = [
  {
    code: "en",
    text: "English",
  },
  {
    code: "ko",
    text: "한국어",
  },
];
export const defaultLang = "en";
export const dictionaries = {
  en,
  ko,
};

export function isLangSupported(lang) {
  if (langList.some((item) => item.code === lang)) return true;
  else return false;
}

export function getDictionary(lang, part) {
  if (part) return dictionaries[lang][part];
  else return dictionaries[lang];
}
