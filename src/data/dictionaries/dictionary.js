import { en } from "./en.js";
import { ko } from "./ko.js";

export const langList = [
  {
    code: "en",
    text: "English",
    icon: "🇬🇧",
    description: "Language settings",
  },
  {
    code: "ko",
    text: "한국어",
    icon: "🇰🇷",
    description: "언어 설정",
  },
  {
    code: "es",
    text: "Español",
    icon: "🇪🇸",
    description: "Configuración de idioma",
  },
  {
    code: "fr",
    text: "Français",
    icon: "🇫🇷",
    description: "Paramètres de langue",
  },
  {
    code: "de",
    text: "Deutsch",
    icon: "🇩🇪",
    description: "Spracheinstellungen",
  },
  {
    code: "ja",
    text: "日本語",
    icon: "🇯🇵",
    description: "言語設定",
  },
  {
    code: "tr",
    text: "Türkçe",
    icon: "🇹🇷",
    description: "Dil ayarları",
  },
];

export const defaultLang = "en";
export const dictionaries = {
  en,
  ko,
};

export function isLangSupported(lang) {
  if (dictionaries[lang]) return true;
  else return false;
}

export function getDictionary(lang, part) {
  if (!isLangSupported(lang)) lang = defaultLang; // if not exist in dictionaries,
  if (part && !dictionaries[lang][part]) lang = defaultLang;

  if (part) return dictionaries[lang][part];
  else return dictionaries[lang];
}
