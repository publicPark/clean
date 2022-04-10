import styles from './Place.module.scss'

import { Link } from "react-router-dom";

const Place = ({ id, name, days, members, description, test }) => {

  return (
    <div>
      <Link to={`/place/${id}`} className={ styles.Link }>
        <b>{name}</b>
      </Link>
      { test? ' (테스트용 공개)' : '' }
      {/* ({members.length}명) */}
    </div>
  )
}

export default Place