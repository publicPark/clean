
import styles from './Clean.module.scss'
import { Link } from "react-router-dom";

import { db } from '../../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Dies from '../Detail/Dies';

const LastClean = ({ place }) => {
  const [loading, setLoading] = useState(false)
  const [clean, setClean] = useState()

  useEffect(() => {
    const q = query(collection(db, "cleans"),
      where("where", "==", place.id),
      orderBy("date", "desc"),
      orderBy("created", "desc"),
      limit(1)
    );
    setLoading(true)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("querySnapshot3", querySnapshot)
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()
        setClean(d)
      });
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot3", error)
    });

    return () => unsubscribe() // 아놔..
  }, [place])

  return (
    <div className={styles.Space}>
      {loading ? <CircularProgress color="primary" /> : <>
        <div>
          <Link to={`/place/${place.id}`} className={ styles.Title }>
            <b>{place.name}</b>
          </Link>
          { place.test && ' (public)' }
        </div>

        <div>
          {
            clean ? <Dies clean={clean} place={place}/>
            :<div className={styles.Blur}>
              <div className={styles.Who}>청소한 적이 없음</div>
            </div>
          }
        </div>
      </>
      }
    </div>
  )
}
export default LastClean