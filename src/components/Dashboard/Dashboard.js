import stylesPaper from '../styles/Paper.module.scss'
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

      { currentUser && userDetail && userDetail.tester && <MyNews /> }
    </div>
  )
}
export default Dashboard