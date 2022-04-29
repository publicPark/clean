import { Link } from "react-router-dom";

import stylesPaper from '../styles/Paper.module.scss'
import styles from '../styles/List.module.scss'
import { db } from '../../firebase'
import { collection, query, where, limit, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import PlaceButtons from "./PlaceButtons";
import PlaceSimple from '../List/PlaceSimple';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { useAuth } from '../../contexts/AuthContext';
import { getDoomsday } from '../../apis/getDoomsday';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import usePlace from "../../apis/usePlace";

const placesRef = collection(db, "places");
const maxCount = 4

const NewPlaces = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sorted, setSorted] = useState(false)
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)
  const { getLastClean } = usePlace()

  useEffect(() => {
    if (list && list.length > 0) setShowButton(false)
    else setShowButton(true)
  }, [list])

  useEffect(() => {
    let q = query(placesRef, where("test", "==",  true));
    if (currentUser) {
      q = query(placesRef, where("members", "array-contains", currentUser.uid), limit(10));
    }
    setLoading(true)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // console.log("querySnapshot2", querySnapshot)
      let list = []
      snapshot.forEach(async (snap) => {
        let d = snap.data()
        list.push({ ...d, id: snap.id })
        if (snapshot.size === list.length) {
          const res = await getLastClean(snap.id)
          console.log("real res", res)
          // 정렬
          
          setList(list)
          setLoading(false)
        }
      });
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
          <h2 className={styles.Flex}>⭐ {!currentUser ? '남의 청소 🧹 구역' : '내 청소 🧹 구역들'}
            <IconButton sx={{ ml: 1 }}
              aria-label="show" onClick={() => setShowButton((cur) => !cur)}>
              {showButton ? <CloseIcon /> : <AddIcon />}
            </IconButton>
          </h2>
          {loading ?
            <CircularProgress color="primary" />
            :
            <>
              {showButton && <div><PlaceButtons list={list} /></div>}
              <div>
                {list.length >= maxCount && `최대 ${maxCount}개 표시됩니..`}
                {list.length >= maxCount && <Link to='/profile'>더..</Link>}
              </div>
            </>
          }
        </div>
          
        <div>
          <Stack spacing={1}>
            {list.length > 0 && 
              list.map((p, i) => <PlaceSimple key={ i } place={p} /> )
            }
          </Stack>
        </div>
      </div>
    </>
  )
}

export default NewPlaces