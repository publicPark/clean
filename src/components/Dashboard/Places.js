import { Link } from "react-router-dom";
import styles from './Place.module.scss'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import Place from "./Place";
import Clean from "../Dashboard/Clean";

const placesRef = collection(db, "places");

const Places = ({ currentUser, now }) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)
  
  const getData = async () => {
    if (currentUser) {
      // , orderBy("name", "desc")
      const q = query(placesRef, where("members", "array-contains", currentUser.uid));
      setLoading(true)
      const querySnapshot = await getDocs(q);
      setLoading(false)
      let arr = []
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
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
      {!currentUser ?
      <h2>남의 구역들</h2>
      :
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
          
          {/* <Stack direction="row" spacing={1}
            justifyContent="center"
            alignItems="center">
              {list.map((p, i) => <Place {...p} key={i} currentUser={currentUser} />)}
          </Stack> */}
          
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 3 }}>
            {list.map((p, i) => <div key={i}>
              <ListItem alignItems="flex-start">
                <Clean place={p} now={now} currentUser={ currentUser} />
              </ListItem>
              { i<list.length-1 && <Divider component="li" />}
            </div>)}
            </List>
        </div>
        }  
      </>
      }
      
    </>
  )
}

export default Places