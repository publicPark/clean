import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from "react-router-dom";

import stylesPaper from '../styles/Paper.module.scss'
import styles from '../styles/List.module.scss'
import { db } from '../../firebase'
import { collection, query, where, limit, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import PlaceButtons from "./PlaceButtons";
import LastClean from "./LastClean";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { useAuth } from '../../contexts/AuthContext';
import { getDoomsday } from '../../apis/getDoomsday';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const placesRef = collection(db, "places");
const maxCount = 4

const Places = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sorted, setSorted] = useState(false)
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (list && list.length > 0) setShowButton(false)
    else setShowButton(true)
  }, [list])

  useEffect(() => {
    let q = query(placesRef, where("test", "==",  true));
    if (currentUser) {
      q = query(placesRef, where("members", "array-contains", currentUser.uid), limit(10));
      // modified로 정렬
    }
    setLoading(true)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("querySnapshot2", querySnapshot)
      let list = []
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()
        list.push({...d, id:snap.id})
      });
      setList(list)
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot2", error)
    });

    return () => unsubscribe()
  }, [currentUser])

  const handleCleans = (i, d) => {
    let newList = [...list]
    if (!d) {
      newList[i].clean = {}
    } else {
      const { howmany } = getDoomsday(new Date(d.date.seconds * 1000), list[i].days)
      if (currentUser && d.next === currentUser.uid) { // 내 차례일때
        d.myDies = true
        newList[i].howmany = howmany
      } else {
        newList[i].howmany = 1000 + howmany // 내꺼 아니면 제일 나중 순위
      }

      newList[i].clean = d
    }

    let cnt = 0
    list.forEach(el => {
      if(el.clean) cnt++
    });
    
    if (cnt === list.length) {
      console.log("sort!")
      // 정렬
      let newListSorted = [...newList]
      newListSorted.sort((a, b) => { 
        return a.howmany - b.howmany
      })
      setList(newListSorted.slice(0, maxCount))
      setSorted(true)
    } else {
      // console.log("don't sort yet", cnt)
      setList(newList)
      setSorted(false)
    }
  }

  return (
    <>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2 className={styles.Flex}>{!currentUser ? '남의 구역' : '내 구역들'}
            <IconButton sx={{ ml: 1 }}
              aria-label="show" onClick={() => setShowButton((cur) => !cur)}>
              {showButton ? <CloseIcon /> : <AddIcon />}
            </IconButton>
          </h2>
          {loading ?
            <CircularProgress color="primary" />
            :
            <>
              <div>
                {showButton && <PlaceButtons list={list} />}
              </div>
              {list.length >= maxCount && `최대 ${maxCount}개 표시됩니`}
              {list.length >= maxCount && <Link to='/profile'>더..</Link>}
            </>
          }
        </div>
        {list.length > 0 && 
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {list.map((p, i) => <div key={i}>
              <Box sx={{ p:1 }}>
                <div className={`${styles.Space}`}>
                  {!sorted ?
                    <Box sx={{mb:1}}>
                      <Skeleton variant="rectangular" height={27} />
                    </Box>
                    :
                    <div>
                      <Link to={`/place/${p.id}`} className={ styles.Title }>
                        <b>{p.name}</b>
                      </Link>
                      { p.test && ' (public)' }
                    </div>
                  }
                  <div>
                    <LastClean place={p} index={i} cleanChanged={handleCleans} sorted={ sorted} />
                  </div>
                </div>
              </Box>
              { i<list.length-1 && <Divider component="li" />}
            </div>)}
          </List>
        }
      </div>
    </>
  )
}

export default Places