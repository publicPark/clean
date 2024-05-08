import { useEffect, useState } from "react";
import { getDictionary } from "../data/dictionaries/dictionary";
import { useTheme } from "../contexts/ThemeContext";

export function useLang(part) {
  const { lang } = useTheme();
  const [dict, setDict] = useState(getDictionary(lang, part));

  useEffect(() => {
    setDict(getDictionary(lang, part));
    // console.log();
  }, [lang, part]);
  return { dict };
}
