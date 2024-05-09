import getBrowserName from "../../apis/getBrowserName";
import styles from "./Navbar.module.scss";
import { useEffect, useState } from "react";
import format from "date-fns/format";
import useNow from "../../apis/useNow";
import { useAuth } from "../../contexts/AuthContext";

import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useLang } from "../../hook/useLang";

const br = getBrowserName();
let msg = "";
let nono = false;
if (br === "chrome") {
  msg = "크롬은 합격 😎👌";
} else if (br === "safari") {
  msg = "사파리도 합격 🥱";
} else if (br === "edge") {
  msg = "엣지? 🥱";
} else if (br === "kakao") {
  msg =
    "카톡에서는 구글 로그인을 지원하지 않아요 😨 다른 브라우저로 열어주세요";
  nono = true;
} else {
  msg = "이 브라우저는 지원하지 않아요 😨 " + br;
  nono = true;
}

const BrowserDetect = () => {
  const [open, setOpen] = useState(true);
  const { currentUser } = useAuth();
  const { now } = useNow();
  const [indexMsg, setIndexMsg] = useState(0);
  const { dict } = useLang("terms");
  const [randomList, setRandomList] = useState([]);

  useEffect(() => {
    setIndexMsg(Math.floor(Math.random() * randomList.length));
  }, [randomList]);

  useEffect(() => {
    setRandomList([dict.refresh, dict.brain, dict.guest, dict.workout]);
  }, [dict]);

  return (
    // nono &&
    <Collapse in={open} sx={{ p: 1 }}>
      <Alert
        severity={nono ? "error" : "info"}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {nono ? (
          msg
        ) : !currentUser ? (
          randomList[indexMsg]
        ) : (
          <>
            <span className={styles.Hello}>
              즐거운 청소! <b className="accent3">{currentUser.displayName}</b>{" "}
              하이
            </span>
            {/* <b className="accent">{format(now, 'HH:mm:ss')}</b> */}
            <div>{randomList[indexMsg]}</div>
          </>
        )}
      </Alert>
    </Collapse>
  );
};

export default BrowserDetect;
