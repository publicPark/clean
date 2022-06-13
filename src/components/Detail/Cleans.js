import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"; 
import Clean from './Clean';
import DiesIrae from "../Detail/DiesIrae";
import styles from './Clean.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { useAuth } from '../../contexts/AuthContext';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';

const Cleans = ({ place, userMap }) => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [cleans, setCleans] = useState()
  const [lastClean, setLastClean] = useState()
  const [nextCursor, setNextCursor] = useState()
  
  const moreCleans = async () => {
    getCleans(nextCursor)
  }

  // 이걸 실시간으로 안하는 건 페이징이라서야
  const getCleans = async (more) => {
    let q;
    let args = [
      collection(db, "cleans"),
      where("where", "==", place.id),
      // where("objection", "!=", true),
      // orderBy("objection"),
      orderBy("date", "desc"),
      orderBy("created", "desc"),
    ]
    if (more) {
      args.push(startAfter(nextCursor))
    }
    args.push(limit(4))
    q = query(...args);

    setLoading(true)
    const snapshots = await getDocs(q);

    const lastVisible = snapshots.docs[snapshots.docs.length-1]
    setNextCursor(lastVisible)
    // console.log("nextCursor lastVisible", lastVisible)

    let arr = []
    if (more) {
      arr = [...cleans]
    }

    let tempLastClean = null
    snapshots.forEach(async (snap) => {
      const data = snap.data()
      // console.log(`CLEANs: ${snap.id} => ${data}`);
      if (!more && !tempLastClean) {
        if (!data.objection) {
          if (currentUser && data.next === currentUser.uid) {
            data.myDies = true
          }
          tempLastClean = data
          setLastClean(tempLastClean)
        } else {
          setLastClean()
        }
      }
      arr.push({...data, id: snap.id})
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
          {cleans && cleans.length && lastClean && 
            <Box sx={{ p: 1, pt: 0}}>
              {/* {place && <Dies clean={c} place={place} />} */}
              {place &&
                <Card sx={{ minWidth: 250, textAlign: 'left' }}
                  elevation={3}>
                  <CardContent>
                    <DiesIrae place={place} data={lastClean} />
                  </CardContent>    
                </Card>
              }
            </Box>
          }
          
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {cleans.map((c, i) => <div key={i}>
              <ListItem alignItems="flex-start">
                <div className={ styles.Wrapper }>
                  <Clean clean={c} place={place} getCleans={getCleans} index={i} userMap={ userMap }/>
                </div>
              </ListItem>
              {i < cleans.length - 1 && <Divider component="li" sx={{ mt:1 }}/>}
            </div>
            )}
          </List>
          
          {loading && <div><CircularProgress color="primary" /></div>}
          { nextCursor &&
            <Button sx={{ m: 1.5 }} variant="outlined" color="neutral"
              onClick={moreCleans}
            >
              more
            </Button>
          }
        </>
        : cleans &&
        <div className={ stylesPaper.Content }>
          <div>여기는 청소한 적이 없음.</div>
        </div>
      }
    </>
  )
}

export default Cleans