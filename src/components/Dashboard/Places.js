import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, query, where, limit, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import PlaceButtons from "./PlaceButtons";
import LastClean from "./LastClean";
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../contexts/AuthContext';

const placesRef = collection(db, "places");

const Places = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    let q = query(placesRef, where("test", "==",  true));
    if (currentUser) {
     q = query(placesRef, where("members", "array-contains", currentUser.uid), limit(5));
    }
    setLoading(true)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("querySnapshot2", querySnapshot)
      setList([])
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()
        setList((cur) => [...cur, {...d, id:snap.id}])
      });
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot2", error)
    });

    return () => unsubscribe()
  }, [currentUser])

  return (
    <>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          {loading ?
            <CircularProgress color="primary" />
            :
            <>
              <PlaceButtons list={list} />
              {list.length >= 5 && '최대 5개만 표시됩니다.'}
            </>
          }
        </div>
        {list.length > 0 && 
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {list.map((p, i) => <div key={i}>
              <ListItem alignItems="flex-start">
                <LastClean place={p} />
              </ListItem>
              { i<list.length-1 && <Divider component="li" />}
            </div>)}
          </List>
        }
      </div>
    </>
  )
}

export default Places