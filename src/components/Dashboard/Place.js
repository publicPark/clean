import styles from './Place.module.scss'

import { Link } from "react-router-dom";

const Place = ({ id, name, days, members, description, test }) => {

  return (
    <div>
      <Link to={`/place/${id}`} className={ styles.Link }>
        <b>{name}</b>
      </Link>
      { test? ' (공개 구역)' : '' }
      {/* ({members.length}명) */}
    </div>
  )
}

export default Place