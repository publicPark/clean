import { db } from '../../firebase'
import { Link } from "react-router-dom";
import styles from './Common.module.scss'
import { collection, query, orderBy, limit, doc, onSnapshot, getDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const News = ({ currentUser, maxCount=7 }) => {
  let navigate = useNavigate();
  const [cleans, setCleans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cRef = collection(db, "cleans");
    let q = query(cRef, orderBy("created", "desc"), limit(maxCount));
    setLoading(true)
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let arr = []
      querySnapshot.forEach((snap) => {
        let d = snap.data()
        arr.push(d)
      });

      let newArr = []
      for (let x in arr) {
        let d = arr[x]
        const docRef = doc(db, "places", d.where);
        const userDocSnap = await getDoc(docRef);
        d.placeData = userDocSnap.data()
        d.placeData.id = userDocSnap.id
        newArr.push(d)
        // console.log("news", d)
      }
      setCleans(newArr)
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot in news", error)
    });

    return () => unsubscribe()
  }, [])

  return (
    <>
      <h2>마을의 따끈따끈 🔥 청소 소식</h2>
      {loading && Array.from(new Array(4)).map((ghost, i) => <div key={ i }>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </div>)
      }
      {cleans.map((c, i) => {
        return <div key={i} className={styles.Left}>
          <Divider sx={{ mt: 2, mb: 2 }} />
          {c.placeData && 
          <>
            { c.placeData.test ? '모두의 구역 ' : 
              currentUser && c.placeData.members.includes(currentUser.uid) ?
              '내 구역 '
              :
              <span className={styles.Blur}>남의 구역 </span>
            }
            
            {currentUser && c.placeData.members.includes(currentUser.uid) || c.placeData.test ?
              <Link to={`/place/${c.placeData.id}`}>
                <b>{c.placeData && c.placeData.name}</b>
              </Link>
              :
              <b>{c.placeData && c.placeData.name}</b>
            }
            
          </>
          }
          
          <span>에 새로운 청소가 등록되었다! </span>
          <span className={styles.Blur}>
            {formatDistanceToNow(new Date(c.created.seconds * 1000), { addSuffix: true })} 
          </span>
          
        </div>
      })}
    </>
  )
}

export default News