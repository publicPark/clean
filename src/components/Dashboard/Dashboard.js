import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import Places from "./Places";
import Voices from "./Voices";
import format from 'date-fns/format'
import useNow from "../../apis/useNow";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = ({ }) => {
  const { currentUser } = useAuth()
  const { now } = useNow()
  
  return (
    <div className={ stylesPaper.Flex }>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>즐거운 청소!</h2>
          {/* <h3 className={ stylesPaper.Blur }>{format(now, "yyyy-MM-dd")}</h3> */}
          <h2 className={ stylesPaper.ColorAccent2 }>{format(now, 'HH:mm:ss')}</h2>
          {currentUser ?
            <>
              <p><b className="accent3">{currentUser.displayName}</b> 하이</p>
            </>
            :
            <>
              <p>로그인을 하면, 청소할 수 있지!</p>
            </>
          }
        </div>
      </div>

      
      <Places />
      
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>청소 애호가들의 한마디</h2>
          <Voices />
        </div>
      </div>

      {/* <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News currentUser={ currentUser } />
        </div>
      </div> */}
    </div>
  )
}
export default Dashboard