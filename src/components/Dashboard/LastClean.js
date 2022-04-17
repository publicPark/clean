
import styles from './Clean.module.scss'
import { Link } from "react-router-dom";

import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Dies from '../Detail/Dies';

const LastClean = ({ place, currentUser }) => {
  const [loading, setLoading] = useState(false)
  const [clean, setClean] = useState()
  
  const getLastClean = async (id) => {
    const q = query(collection(db, "cleans"), where("where", "==", id), orderBy("date", "desc"), orderBy("created", "desc"), limit(1));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)
    querySnapshot.forEach((doc) => {
      // console.log(`CLEAN: ${doc.id} => ${doc.data()}`);
      const data = doc.data()

      setClean(data)
    });
  }

  useEffect(() => {
    getLastClean(place.id)
  },[])

  return (
    <div className={styles.Space}>
      {loading ? <CircularProgress color="primary" /> : <>
        <div>
          <Link to={`/place/${place.id}`} className={ styles.Title }>
            <b>{place.name}</b>
          </Link>
          { place.test && ' (공개 구역)' }
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