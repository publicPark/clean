import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

import styles from '../styles/List.module.scss'
import { db } from '../../firebase'
import { collection, query, where, limit, startAfter, getDocs, orderBy } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const placesRef = collection(db, "places");

const Places = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [nextCursor, setNextCursor] = useState()
  
  const moreCleans = async () => {
    getPlaces(nextCursor)
  }

  // 이걸 실시간으로 안하는 건 페이징이라서야
  const getPlaces = async (more) => {
    let q;
    let args = [
      placesRef,
      where("members", "array-contains", currentUser.uid),
      orderBy("created", "desc"),
    ]
    if (more) {
      args.push(startAfter(nextCursor))
    }
    args.push(limit(10))
    q = query(...args);

    setLoading(true)
    const snapshots = await getDocs(q);

    const lastVisible = snapshots.docs[snapshots.docs.length-1]
    setNextCursor(lastVisible)
    console.log("nextCursor lastVisible", lastVisible)

    
    let arr = []
    if (more) {
      arr = [...list]
    }
    snapshots.forEach((doc) => {
      const data = doc.data()
      // console.log(`CLEANs: ${doc.id} => ${data}`);
      arr.push({...data, id: doc.id})
    });
    
    setLoading(false)
    setList(arr)
  }

  useEffect(() => {
    getPlaces()
  }, [])

  return (
    <>
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
              </div>
            </ListItem>
            { i<list.length-1 && <Divider component="li" />}
          </div>)}
        </List>
      }

      {loading && <div><CircularProgress color="primary" /></div>}
      { nextCursor &&
        <Button sx={{ m: 1.5 }} variant="outlined" color="neutral"
          onClick={moreCleans}
        >
          more
        </Button>
      }
    </>
  )
}

export default Places