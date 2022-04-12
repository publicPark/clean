import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 
import Clean from './Clean';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';

const Cleans = ({ place }) => {
  const [loading, setLoading] = useState(false)
  const [cleans, setCleans] = useState()
  
  const getLastCleans = async (id) => {
    const q = query(collection(db, "cleans"), where("where", "==", id), orderBy("date", "desc"), limit(10));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)

    let arr = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`CLEANs: ${doc.id} => ${data}`);
      arr.push({...data, id: doc.id})
    });
    setCleans(arr)
  }

  useEffect(() => {
    getLastCleans(place.id)
  }, [])
  
  return (
    <>
      {loading ? <CircularProgress color="primary" /> : cleans &&
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {cleans.map((c, i) => <div key={i}>
            <ListItem alignItems="flex-start">
              <Clean clean={c} place={place} isRecord={ i!==0 } />
            </ListItem>
            {i < cleans.length - 1 && <Divider component="li" />}
          </div>)}
        </List>
      }
    </>
  )
}

export default Cleans