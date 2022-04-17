import { db } from '../../firebase'
import { collection, doc, getDoc, getDocs, addDoc, query, where, onSnapshot, limit, orderBy, updateDoc } from "firebase/firestore";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './Common.module.scss'
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

const voicesRef = collection(db, "voices")

const Voices = () => {
  const { currentUser } = useAuth()
  const [say, setSay] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  const handleSay = async (e) => {
    e.preventDefault();
    
    if (!say) return
    
    const q = query(voicesRef, where("who", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    console.log("length", querySnapshot.length)

    let count = 0
    querySnapshot.forEach(async (d) => {
      count++
      setLoading(true)
      const docRef = doc(db, "voices", d.id);
      await updateDoc(docRef, {
        lastDate: new Date(),
        say: say
      });
    });

    if (!count) {
      setLoading(true)
      await addDoc(voicesRef, {
        who: currentUser.uid,
        target: 'all',
        say: say,
        created: new Date(),
        lastDate: new Date()
      });
    }

    setSay('')
    setLoading(false)
  } 

  useEffect(() => {
    const q = query(voicesRef, where("target", "==", "all"), orderBy("lastDate", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot", querySnapshot)
      const arr = [];
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()

        const docRef = doc(db, "users", d.who);
        const userDocSnap = await getDoc(docRef);
        d.whoData = userDocSnap.data()
      
        arr.push(d);

      });
      setList(arr)
    },
    (error) => {
      console.log("querySnapshot", error)
    });

    return () => unsubscribe() // 아놔..
  }, [])
  
  return (
    <>
      { currentUser &&
        <form onSubmit={handleSay}>
          <div>
            <TextField id="standard-basic" label={`한마디`} variant="standard" sx={{ mb:1 }}
              value={ say }
              onChange={ (e)=>setSay(e.target.value) }
            />
          </div>
          <Button type="submit" variant="contained" onClick={ handleSay } disabled={ loading }>SAY</Button>
        </form>
      }
      {
        list.length ?
        <List sx={{ mt:2, width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {list.map((l, i) => {
            return (
              <ListItem key={ i } alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={ l.whoData.name } src={ l.whoData.photoURL } />
                </ListItemAvatar>
                <ListItemText
                  primary={ l.say }
                  secondary={
                    <>
                      {/* {l.who === currentUser.uid? '(나)' : ''} */}
                      {`${l.whoData.name}`}
                      {l.lastDate && ` - ${formatDistanceToNow(new Date(l.lastDate.seconds * 1000), { addSuffix: true })}`}
                    </>
                  }
                />
              </ListItem>
            )
          })}
        </List>
        :
        <div></div>
      }
    </>
  )
}
export default Voices