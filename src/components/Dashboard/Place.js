
import Chip from '@mui/material/Chip';
import styles from './Place.module.scss'

import { useNavigate, Link } from "react-router-dom";

const Place = ({ id, name, days, members, description }) => {
  let navigate = useNavigate();
  const handleClick = () => {
    navigate(`/place/${id}`)
  }

  return (
    <div className={ styles.Link }>
      <Link to={`/place/${id}`}>
        <b>{name}</b>
      </Link>
      {/* <Chip label={name} onClick={handleClick} color="primary" /> */}
    </div>
  )
}

export default Place