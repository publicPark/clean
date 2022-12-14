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
      <p>
        여긴 
        청소 당번이 누구인지,<br />
        언제까지 청소해야 하는지<br />
        알려주는 곳<br /><br />
        <Link to="/about"><b>자세히 알아보기</b></Link>
      </p>
      {/* <h3 className={ stylesPaper.Blur }>{format(now, "yyyy-MM-dd")}</h3> */}
      <h2 className="accent">{format(now, 'HH:mm:ss')}</h2>
      {currentUser ?
        <>
          <p><b className="accent3">{currentUser.displayName}</b> 하이</p>
        </>
        :
        <>
          <p>로그인을 하면, 청소할 수 있지!</p>
        </>
      }
    </>
  )
}
export default Clock