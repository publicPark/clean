import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import Places from "./Places";
import Voices from "./Voices";
import { useAuth } from "../../contexts/AuthContext";
import Clock from './Clock';

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
      
      <Places />

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News currentUser={ currentUser } />
        </div>
      </div>
      
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>청소 애호가들의 한마디</h2>
        </div>
        <Voices />
      </div>
    </div>
  )
}
export default Dashboard