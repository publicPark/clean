import  { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.scss'
const Dashboard = () => {
  const { currentUser } = useAuth()

  return (
    <div className={styles.WrappersWrapper}>
      <div className={styles.Wrapper}>
        <div className={styles.Content}>
          <h1>여기가 뭐하는 데냐면</h1>
          {currentUser && <div>안녕하시고 { currentUser.displayName }</div>}
        </div>
      </div>
    </div>
  )
}
export default Dashboard