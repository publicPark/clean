import { useTheme } from "../../contexts/ThemeContext";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import {
  langList,
  isLangSupported,
  getLangObject,
} from "../../data/dictionaries/dictionary";
import styles from "./SettingLang.module.scss";
import { useLang } from "../../hook/useLang";

const options = langList;
const SettingLang = () => {
  const { lang, changeLang } = useTheme();
  const { dict } = useLang();
  const foundLangObj = getLangObject(lang);
  const [value, setValue] = useState(foundLangObj);
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          p: 2,
          textAlign: "center",
          maxWidth: 500,
          margin: "auto",
        }}
      >
        <div className={styles.wrapper}>
          {langList.map((l, i) => (
            <span
              key={i}
              className={l.code === foundLangObj.code ? styles.bold : undefined}
            >
              {l.description}{" "}
            </span>
          ))}
        </div>

        <Autocomplete
          fullWidth
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (newValue) {
              changeLang(newValue.code);
            }
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="select-lang"
          options={options}
          getOptionLabel={(option) =>
            option ? `${option.icon} ${option.label} (${option.code}) ` : ""
          }
          getOptionDisabled={(option) => !isLangSupported(option.code)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="" fullWidth />}
        />
        <div className={styles.wrapper}>{dict.lang}</div>
      </Stack>
    </>
  );
};
export default SettingLang;
