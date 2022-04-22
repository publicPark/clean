import format from 'date-fns/format'
import { Link } from 'react-router-dom';
import useNow from "../../apis/useNow";
import { useAuth } from "../../contexts/AuthContext";

const Clock = () => {
  const { currentUser } = useAuth()
  const { now } = useNow()
  return (
    <>
      <h2>즐거운 청소!</h2>
      {/* <h3 className={ stylesPaper.Blur }>{format(now, "yyyy-MM-dd")}</h3> */}
      <h2 className="accent2">{format(now, 'HH:mm:ss')}</h2>
      {currentUser ?
        <>
          <p><b className="accent3">{currentUser.displayName}</b> 하이</p>
        </>
        :
        <>
          <p>로그인을 하면, 청소할 수 있지!</p>
          <p><Link to="/about">여긴 뭐하는 데죠?</Link></p>
        </>
      }
    </>
  )
}
export default Clock