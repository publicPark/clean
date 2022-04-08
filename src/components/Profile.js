import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Profile.module.scss'
import { useTheme } from '../contexts/ThemeContext'

const Profile = () => {
  const { darkTheme, toggleTheme } = useTheme()
  const { currentUser, googleAuth, userSignOut } = useAuth()
  const [openSlide, setOpenSlide] = useState(false)
  const handleGoogleAuth = (e) => {
    googleAuth()
  }
  const handleSignOut = () => {
    userSignOut()
  }

  const toggleSlide = () => {
    setOpenSlide((cur)=>!cur)
  }

  return (
    <div className={styles.Profile}>
      {currentUser ?
        <div>
          <div
            className={styles.Photo}
            style={{ backgroundImage: 'url(' + currentUser.photoURL + ')' }}
            onClick={toggleSlide}
          ></div>
          {openSlide && <div className={styles.SlideBack} onClick={()=>setOpenSlide(false)}></div>}
          <div className={`${styles.Slide} ${openSlide && styles.Open}`}>
            <div><b>{currentUser.displayName}</b> 하이</div>
            <div>
              <button className={styles.ButtonTheme} onClick={toggleTheme}>{ darkTheme? '🌜':'🌻' }</button>
              <button onClick={handleSignOut}>로그아웃</button>
              <button onClick={toggleSlide}>닫기</button>
            </div>
          </div>
        </div>
        :
        <div>
          <button onClick={handleGoogleAuth}>구글로긴</button>
        </div>
      }
    </div>
  )
}

export default Profile