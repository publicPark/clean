import { getDictionary } from "../data/dictionaries/dictionary";
import { useTheme } from "../contexts/ThemeContext";

export function useLang(part) {
  const { lang } = useTheme();
  return { dict: getDictionary(lang, part) };
}
