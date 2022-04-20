
import styles from './Clean.module.scss'

import { db } from '../../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Dies from '../Detail/Dies';

const LastClean = ({ place, index, cleanChanged }) => {
  const [loading, setLoading] = useState(false)
  const [clean, setClean] = useState()

  // 가장 최근 청소 가져오기
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
        if (!place.clean) { // 부모쪽에 clean 정보 없으면 세팅
          cleanChanged(index, d)
        }
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
      {loading ? <CircularProgress color="primary" /> : clean ?
        <Dies clean={clean} place={place} />
        :<div className={styles.Blur}>
          <div className={styles.Who}>청소한 적이 없음</div>
        </div>
      }
    </div>
  )
}
export default LastClean