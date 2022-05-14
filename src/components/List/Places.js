import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, query, where, limit, orderBy, getDocs } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import PlaceSimple from '../List/PlaceSimple';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


import { useAuth } from '../../contexts/AuthContext';

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
    
    let arr = []
    if (more) {
      arr = [...list]
    }
    snapshots.forEach((doc) => {
      const data = doc.data()
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
      <div className={stylesPaper.Wrapper}>
        <div>
          <Stack spacing={1}>
            {list.length > 0 && 
              list.map((p, i) => <PlaceSimple key={i} place={p} hideDies={true} /> )
            }
          </Stack>
        </div>
      </div>

      {loading && <div><CircularProgress color="primary" sx={{mb:2}}/></div>}
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