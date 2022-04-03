import GoogleAuth from "./Profile";
import styles from './Navbar.module.scss'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        <Link to='/'><button className={styles.ButtonTheme}>🏠</button></Link>
        <GoogleAuth/>
      </div>
    </div>
  )
}

export default Navbar;