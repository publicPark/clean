import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"; 
import Clean from './Clean';
import Dies from './Dies'
import styles from './Clean.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Cleans = ({ place, userMap }) => {
  const [loading, setLoading] = useState(false)
  const [cleans, setCleans] = useState()
  const [nextCursor, setNextCursor] = useState()
  
  const moreCleans = async () => {
    getCleans(nextCursor)
  }

  const getCleans = async (more) => {
    let q;
    let args = [
      collection(db, "cleans"),
      where("where", "==", place.id),
      orderBy("date", "desc"),
      orderBy("created", "desc"),
    ]
    if (more) {
      args.push(startAfter(nextCursor))
    }
    args.push(limit(5))
    q = query(...args);

    setLoading(true)
    const snapshots = await getDocs(q);

    const lastVisible = snapshots.docs[snapshots.docs.length-1]
    setNextCursor(lastVisible)
    console.log("nextCursor lastVisible", lastVisible)

    
    let arr = []
    if (more) {
      arr = [...cleans]
    }
    snapshots.forEach((doc) => {
      const data = doc.data()
      // console.log(`CLEANs: ${doc.id} => ${data}`);
      arr.push({...data, id: doc.id})
    });
    
    setLoading(false)
    setCleans(arr)
  }

  useEffect(() => {
    getCleans()
  }, [])
  
  return (
    <>
      { cleans && cleans.length > 0 ?
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {cleans.map((c, i) => <div key={i}>
              {i === 0 && 
                <>
                  <ListItem>
                  {place && <Dies clean={c} place={place} />}
                  </ListItem> <Divider component="li" sx={{ mt:1 }} />
                </>
              }
              <ListItem alignItems="flex-start">
                <div className={ styles.Wrapper }>
                  <Clean clean={c} place={place} getCleans={getCleans} index={i} userMap={ userMap }/>
                </div>
              </ListItem>
              {i < cleans.length - 1 && <Divider component="li" sx={{ mt:1 }}/>}
            </div>
            )}
          </List>

          { nextCursor &&
            <Button sx={{ m: 1.5 }} variant="outlined" color="neutral"
              onClick={moreCleans}
            >
              more
            </Button>
          }
        </>
        :
        <div className={ stylesPaper.Content }>
          <div>여기는 청소한 적이 없음.</div>
        </div>
      }

      { loading && <CircularProgress color="primary" /> }
    </>
  )
}

export default Cleans