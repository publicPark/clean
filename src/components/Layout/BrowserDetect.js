import getBrowserName from "../../apis/getBrowserName"
import Alert from '@mui/material/Alert';

const br = getBrowserName()
let msg = ""
let nono = false
if (br === "chrome") {
  msg = ("크롬을 쓰는 당신은 합격입니다. 😎👌")
} else if (br === "safari") {
  msg = ("사파리도 괜찮겠지요. 🥱")
} else {
  msg = ("이 브라우저는 불합격 같은데... 😨")
  nono = true
}

const BrowserDetect = () => {
  return (
    // nono &&
    <>
      <Alert severity={ nono?"error":"success" }>{ msg }</Alert>
    </>
  )
}

export default BrowserDetect;