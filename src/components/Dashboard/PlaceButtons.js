import { Link } from "react-router-dom";
import styles from '../styles/List.module.scss'
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";

const PlaceButtons = ({ list }) => {
  const { currentUser } = useAuth()

  return (
    <>
      {currentUser ?
        <>
          <Link to="/placeform"><Button sx={{ mb: 1 }} variant="contained" color="secondary">청소 구역 생성</Button></Link>
          <Link to="/placejoin"><Button sx={{ mb: 1, ml: 1 }} variant="contained" color="secondary">참가하기</Button></Link>
        </>
        :
        <>로그인을 하면 내 구역</>
      }
      {/* <Divider sx={{ mt: 2, mb: 3 }} variant="middle" /> */}
    </>
  )
}

export default PlaceButtons