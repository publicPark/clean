import { Link } from "react-router-dom";
import styles from './Place.module.scss'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

import { useEffect, useState } from 'react';

const PlaceButtons = ({ currentUser, list }) => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (list && list.length > 0) setShowButton(false)
    else setShowButton(true)
  }, [list])

  return (
    <div>
      <h2 className={styles.Flex}>{!currentUser ? '남의 구역' : '내 구역들'}
        <IconButton sx={{ ml: 1 }}
          aria-label="show" onClick={() => setShowButton((cur) => !cur)}>
          {showButton ? <CloseIcon /> : <AddIcon />}
        </IconButton>
      </h2>
      {showButton && 
        <>
          {currentUser ?
          <div>
            <Link to="/placeform"><Button sx={{ mr: 1, mb: 1 }} variant="contained" color="warning">청소 구역 생성</Button></Link>
            <Link to="/placejoin"><Button sx={{ mb: 1 }} variant="contained" color="success">참가하기</Button></Link>
          </div>
          :
          <div>로그인을 하면 내 구역</div>
          }
          {/* <Divider sx={{ mt: 2, mb: 3 }} variant="middle" /> */}
        </>
      }
    </div>
  )
}

export default PlaceButtons