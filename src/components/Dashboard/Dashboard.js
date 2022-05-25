import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import { useAuth } from "../../contexts/AuthContext";
import Clock from './Clock';
import Invitations from './Invitations';
import NewPlaces from './NewPlaces';

const Dashboard = ({ }) => {
  const { currentUser } = useAuth()
  
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

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News currentUser={ currentUser } />
        </div>
      </div>
    </div>
  )
}
export default Dashboard