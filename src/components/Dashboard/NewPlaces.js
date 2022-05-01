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
        let pl = snap.data() // 구역

        // 마지막 청소
        const cl = await getLastClean(snap.id)
        if (cl) { // 청소가 없을 수도 있어
          const { howmany, doomsday } = getDoomsday(new Date(cl.date.seconds * 1000), pl.days)
          pl.doomsday = doomsday
          pl.howmany = howmany
          if (currentUser && cl.next === currentUser.uid) { // 내 차례일때
            pl.myDies = true
            pl.sort = howmany
          } else {
            pl.sort = 10000 + howmany // 내꺼 아니면 제일 나중 순위
          }
        } else {
          pl.sort = 0 // 청소 없을 때
        }
        list.push({ ...pl, id: snap.id, lastClean: cl })
        
        if (snapshot.size === list.length) {
          // 정렬
          list.sort((a, b) => { 
            return a.sort - b.sort
          })
          setList(list.slice(0, maxCount))
          // setList(list)
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
          <h2 className={styles.Flex}>{!currentUser ? '남의 청소 구역' : '내 청소 구역들'}
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
              {list.length >= maxCount && `최대 ${maxCount}개 표시됩니..`}
              {list.length >= maxCount && <Link to='/profile'>더..</Link>}
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