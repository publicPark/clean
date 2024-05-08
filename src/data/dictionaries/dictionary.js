import { en } from "./en.js";
import { ko } from "./ko.js";

export const langList = [
  {
    code: "en",
    label: "English",
    icon: "🇬🇧",
    description: "Language settings",
  },
  {
    code: "ko",
    label: "한국어",
    icon: "🇰🇷",
    description: "언어 설정",
  },
  {
    code: "es",
    label: "Español",
    icon: "🇪🇸",
    description: "Configuración de idioma",
  },
  {
    code: "fr",
    label: "Français",
    icon: "🇫🇷",
    description: "Paramètres de langue",
  },
  {
    code: "de",
    label: "Deutsch",
    icon: "🇩🇪",
    description: "Spracheinstellungen",
  },
  {
    code: "ja",
    label: "日本語",
    icon: "🇯🇵",
    description: "言語設定",
  },
  {
    code: "tr",
    label: "Türkçe",
    icon: "🇹🇷",
    description: "Dil ayarları",
  },
];

export const defaultLang = "ko";
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

export function getLangObject(lang) {
  console.log(
    "getLangObject",
    lang,
    langList.find((item) => item.code === lang)
  );
  return langList.find((item) => item.code === lang);
}
