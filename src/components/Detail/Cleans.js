import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 
import Clean from './Clean';
import Dies from './Dies'
import styles from './Clean.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';

const Cleans = ({ place, userMap }) => {
  const [loading, setLoading] = useState(false)
  const [cleans, setCleans] = useState()
  
  const getCleans = async () => {
    const q = query(collection(db, "cleans"),
      where("where", "==", place.id),
      orderBy("date", "desc"),
      orderBy("created", "desc"),
      limit(10)
    );
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)

    let arr = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // console.log(`CLEANs: ${doc.id} => ${data}`);
      arr.push({...data, id: doc.id})
    });
    
    setCleans(arr)
  }

  useEffect(() => {
    getCleans()
  }, [])
  
  return (
    <>
      {loading ? <CircularProgress color="primary" />
        : cleans && cleans.length > 0 ?
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
        :
        <div className={ stylesPaper.Content }>
          <div>여기는 청소한 적이 없음.</div>
        </div>
      }
    </>
  )
}

export default Cleans