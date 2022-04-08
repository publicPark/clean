import { Link } from "react-router-dom";
import styles from './Place.module.scss'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';

import { db } from '../../firebase'
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import Place from "./Place";

const placesRef = collection(db, "places");

const Places = ({ currentUser }) => {
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)
  
  const getData = async () => {
    if (currentUser) {
      const q = query(placesRef, where("members", "array-contains", {
        id: currentUser.uid,
        name: currentUser.displayName,
        photoURL: currentUser.photoURL
      }));
      const querySnapshot = await getDocs(q);
      let arr = []
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        arr.push({ ...doc.data(), id: doc.id })
      });
      setList(arr)
    }
  }

  useEffect(() => {
    getData()
  }, [currentUser])

  useEffect(() => {
    if (list.length > 0) setShowButton(false)
    else setShowButton(true)
  }, [list])

  return (
    <>
      <div>
        <h2>내 구역들 
          <IconButton sx={{ mb: 1, ml: 1 }} 
            aria-label="show" onClick={() => setShowButton((cur) => !cur)}>
            { showButton?<RemoveIcon />:<AddIcon /> }
          </IconButton>
        </h2>
        {showButton && 
        <div>
          <Link to="/placeform"><Button sx={{ mr: 1 }} variant="contained">청소 구역 생성</Button></Link>
          <Link to="/placeform"><Button variant="contained" color="secondary">참가하기</Button></Link>
        </div>}
        
        {/* {JSON.stringify(list)} */}
        <Stack direction="row" spacing={1} mt={2}
          justifyContent="center"
          alignItems="center">
          {list.map((p, i) => <Place {...p} key={i} />)}
        </Stack>
      </div>
    </>
  )
}

export default Places