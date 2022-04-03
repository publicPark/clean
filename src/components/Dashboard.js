import  { useAuth } from '../contexts/AuthContext'
import { Link } from "react-router-dom";
import styles from './Dashboard.module.scss'
const Dashboard = () => {
  const { currentUser } = useAuth()

  return (
    <div className={styles.WrappersWrapper}>
      <div className={styles.Wrapper}>
        <div className={styles.Content}>
          <h1>청소가 취미야!!?!!</h1>
          {currentUser && <>
            <div>안녕하시고 {currentUser.displayName}</div>
            <div>
              <Link to="/clean"><button>청소했냥고!</button></Link>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}
export default Dashboard