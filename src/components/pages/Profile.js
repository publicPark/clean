import { useAuth } from "../../contexts/AuthContext"
import stylesPaper from '../styles/Paper.module.scss'
import ProfileForm from '../Form/ProfileForm';
import Places from "../List/Places";

const Profile = () => {
  const { currentUser:user } = useAuth()

  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <ProfileForm />
        </div>
      </div>

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>내 모든 구역들</h2>
        </div>
        <Places />
      </div>
    </div>
  )
}

export default Profile