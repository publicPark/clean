import getBrowserName from "../../apis/getBrowserName"
import styles from './Navbar.module.scss'
import { useState } from "react";

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const br = getBrowserName()
let msg = ""
let nono = false
if (br === "chrome") {
  msg = ("크롬은 합격 😎👌")
} else if (br === "safari") {
  msg = ("사파리도 합격 🥱")
} else if (br === "edge") {
  msg = ("엣지? 🥱")
} else if (br === "kakao"){
  msg = ("카톡에서는 구글 로그인을 지원하지 않아요 😨 다른 브라우저로 열어주세요")
  nono = true
} else {
  msg = ("이 브라우저는 지원하지 않아요 😨 " + br)
  nono = true
}

const BrowserDetect = () => {
  const [open, setOpen] = useState(true);

  return (
    // nono &&
    <Collapse in={open} sx={{ p:1 }}>
      <Alert severity={nono ? "error" : "success"}
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
        {nono ? msg
          :
          '옛날 데이터를 보고 있는 것 같다면, 새로고침을 가끔씩 해주세요.'
        }
      </Alert>
    </Collapse>
  )
}

export default BrowserDetect;