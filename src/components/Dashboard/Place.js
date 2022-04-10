import styles from './Place.module.scss'

import { Link } from "react-router-dom";

const Place = ({ id, name, days, members, description }) => {

  return (
    <div>
      <Link to={`/place/${id}`} className={ styles.Link }>
        <b>{name}</b>
      </Link>
      {/* ({members.length}명) */}
    </div>
  )
}

export default Place