import { Link } from "react-router-dom";
import stylesPaper from '../styles/Paper.module.scss'
import Button from '@mui/material/Button';
import News from "./News";
import Places from "./Places";
const Dashboard = ({ currentUser }) => {

  return (
    <>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>청소를 하면 깨끗해집니다!</h2>
          {currentUser? <>
            <div>
              <Link to="/clean"><Button variant="contained">청소했습니까? 여기를 클릭하세요</Button></Link>
            </div>
          </>
          :<>
              <p>ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁ</p>
              <p>당신은 로그인을 해서 우리집을 청소해야만 해요.</p>
          </>}
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
    </>
  )
}
export default Dashboard