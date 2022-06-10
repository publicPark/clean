import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import { useAuth } from "../../contexts/AuthContext";
import Clock from './Clock';
import Invitations from './Invitations';
import NewPlaces from './NewPlaces';
import MyNews from './MyNews';

const Dashboard = ({ }) => {
  const { currentUser, userDetail } = useAuth()
  
  return (
    <div className={ stylesPaper.Flex }>

      {!currentUser &&
        <div className={stylesPaper.Wrapper}>
          <div className={stylesPaper.Content}>
            <Clock/>
          </div>
        </div>
      }
      
      {currentUser && <Invitations /> }
      <NewPlaces />

      { userDetail && userDetail.tester && <MyNews /> }

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News currentUser={ currentUser } />
        </div>
      </div>
    </div>
  )
}
export default Dashboard