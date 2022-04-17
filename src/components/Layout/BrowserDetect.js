import getBrowserName from "../../apis/getBrowserName"
import Alert from '@mui/material/Alert';
import styles from './Navbar.module.scss'

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
  msg = ("카톡에서는 구글 로그인을 지원하지 않아요 😨 다른 브라우저로 열어주세요.")
  nono = true
} else {
  msg = ("이 브라우저는 지원하지 않아요 😨 다른 데서 열어주세요" + br)
  nono = true
}

const BrowserDetect = () => {
  return (
    // nono &&
    <div className={styles.Padding0}>
      <Alert severity={ nono?"error":"success" }>{ msg }</Alert>
    </div>
  )
}

export default BrowserDetect;