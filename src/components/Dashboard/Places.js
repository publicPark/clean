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
import { useAuth } from '../../contexts/AuthContext';
import { getDoomsday } from '../../apis/getDoomsday';

const placesRef = collection(db, "places");
const maxCount = 4

const Places = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    let q = query(placesRef, where("test", "==",  true));
    if (currentUser) {
     q = query(placesRef, where("members", "array-contains", currentUser.uid), limit(maxCount));
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

  const handleCleans = (i, d) => {
    let newList = [...list]
    const { howmany } = getDoomsday(new Date(d.date.seconds * 1000), list[i].days)
    if (d.next === currentUser.uid) { // 내 차례일때
      d.myDies = true
      newList[i].howmany = howmany
    } else {
      newList[i].howmany = 1000 + howmany // 내꺼 아니면 제일 나중 순위
    }

    newList[i].clean = d

    let cnt = 0
    list.forEach(el => {
      if(el.clean) cnt++
    });
    
    if (cnt === list.length) {
      console.log("sort")
      // 정렬
      let newListSorted = [...newList]
      newListSorted.sort((a, b) => { 
        return a.howmany - b.howmany
      })
      setList(newListSorted)
    } else {
      console.log("not sort", cnt)
      setList(newList)
    }
  }

  return (
    <>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          {loading ?
            <CircularProgress color="primary" />
            :
            <>
              <PlaceButtons list={list} />
              {list.length >= maxCount && `최대 ${maxCount}개 표시됩니다. `}
              {list.length >= maxCount && <Link to='/profile'>다?</Link>}
            </>
          }
        </div>
        {list.length > 0 && 
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {list.map((p, i) => <div key={i}>
              <ListItem alignItems="flex-start">
                <div className={ styles.Space }>
                  <div>
                    <Link to={`/place/${p.id}`} className={ styles.Title }>
                      <b>{p.name}</b>
                    </Link>
                    { p.test && ' (public)' }
                  </div>
                  <LastClean place={p} index={ i } cleanChanged={ handleCleans } />
                </div>
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