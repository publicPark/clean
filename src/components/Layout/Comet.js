import styles from './Layout.module.scss'
import imgA from '../../assets/comet.png';

const Comet = () => <>
  <div className="Front">
    <div className={styles.Comet}>
      <img src={imgA} alt="" />
    </div>
  </div>
</>

export default Comet