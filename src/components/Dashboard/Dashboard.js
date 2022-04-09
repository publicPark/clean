import { Link } from "react-router-dom";
import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import Places from "./Places";
const Dashboard = ({ currentUser }) => {

  return (
    <div className={ stylesPaper.Flex }>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>청소를 하면 깨끗해집니다!</h2>
          {currentUser ?
            <>
              <p>{currentUser.displayName} 하이</p>
            </>
            :
            <>
              <p>로그인을 하면</p>
              <p>우리 집을 청소할 수 있습니다.</p>
            </>
          }
        </div>
      </div>

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <Places currentUser={ currentUser } />
        </div>
      </div>

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News/>
        </div>
      </div>
    </div>
  )
}
export default Dashboard