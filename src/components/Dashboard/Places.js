import { Link } from "react-router-dom";
import styles from './Place.module.scss'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { db } from '../../firebase'
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import Place from "./Place";

const placesRef = collection(db, "places");

const Places = ({ currentUser }) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)
  
  const getData = async () => {
    if (currentUser) {
      const q = query(placesRef, where("members", "array-contains", {
        id: currentUser.uid,
        name: currentUser.displayName,
        photoURL: currentUser.photoURL
      }));
      setLoading(true)
      const querySnapshot = await getDocs(q);
      setLoading(false)
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
    if (list && list.length > 0) setShowButton(false)
    else setShowButton(true)
  }, [list])

  return (
    <>
      {loading ? '...' : <div>
        <h2 className={styles.Flex}>내 구역들
          <IconButton sx={{ ml: 1 }}
            aria-label="show" onClick={() => setShowButton((cur) => !cur)}>
            {showButton ? <CloseIcon /> : <AddIcon />}
          </IconButton>
        </h2>
        {showButton &&
          <>
            <div>
              <Link to="/placeform"><Button sx={{ mr: 1, mb: 1 }} variant="contained" color="warning">청소 구역 생성</Button></Link>
              <Link to="/placejoin"><Button sx={{ mb: 1 }} variant="contained" color="success">참가하기</Button></Link>
            </div>
            <Divider sx={{ mt: 2, mb: 3 }} variant="middle" />
          </>
        }
        
        {/* {JSON.stringify(list)} */}
        <Stack direction="row" spacing={1}
          justifyContent="center"
          alignItems="center">
          {list.map((p, i) => <Place {...p} key={i} currentUser={currentUser} />)}
        </Stack>
      </div>
      }
    </>
  )
}

export default Places