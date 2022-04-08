import Profile from "./Profile";
import styles from './Navbar.module.scss'
import { Link } from "react-router-dom";

const Navbar = ({ currentUser }) => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        <Link to='/'><button className={styles.ButtonTheme}>🏠</button></Link>
        <Profile/>
      </div>
    </div>
  )
}

export default Navbar;