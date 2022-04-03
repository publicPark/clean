import GoogleAuth from "./GoogleAuth";
import { useTheme } from '../contexts/ThemeContext'
import styles from './Navbar.module.scss'

const Navbar = () => {
  const { darkTheme, toggleTheme } = useTheme()
  return (
    <div className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        <button className={styles.ButtonTheme} onClick={toggleTheme}>{ darkTheme? '🌜':'🌻' }</button>
        <GoogleAuth/>
      </div>
    </div>
  )
}

export default Navbar;