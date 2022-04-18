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
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

const voicesRef = collection(db, "voices")

const Voices = ({ type = "all" }) => {
  const { currentUser } = useAuth()
  const [say, setSay] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [list, setList] = useState([])

  const handleSay = async (e) => {
    e.preventDefault();
    
    if (!say) return
    
    setLoadingSubmit(true)
    const q = query(voicesRef, where("who", "==", currentUser.uid), where("target", "==", type));
    const querySnapshot = await getDocs(q);
    console.log("length", querySnapshot.length)

    let count = 0
    querySnapshot.forEach(async (d) => {
      count++
      const docRef = doc(db, "voices", d.id);
      await updateDoc(docRef, {
        lastDate: new Date(),
        say: say
      });
    });

    if (!count) {
      await addDoc(voicesRef, {
        who: currentUser.uid,
        target: type,
        say: say,
        created: new Date(),
        lastDate: new Date()
      });
    }

    setSay('')
    setLoadingSubmit(false)
  } 

  useEffect(() => {
    setLoading(true)
    const q = query(voicesRef, where("target", "==", type), orderBy("lastDate", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("voices", querySnapshot)
      setList([]);
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()

        const docRef = doc(db, "users", d.who);
        const userDocSnap = await getDoc(docRef);
        d.whoData = userDocSnap.data()
        setList((cur)=>[...cur, d])
      });
      setLoading(false)
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
          <Button type="submit" variant="contained" onClick={ handleSay } disabled={ loadingSubmit }>SAY</Button>
        </form>
      }
      {
        loading ?
          <CircularProgress sx={{ mt: 2 }} color="primary" />
        :
        list.length ?
        <List sx={{ mt:2, width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {list.map((l, i) => {
            return (
              <div key={i}>
                <ListItem key={ i } alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={ l.whoData.name } src={ l.whoData.photoURL } />
                  </ListItemAvatar>
                  <ListItemText
                    primary={ l.say }
                    secondary={
                      <>
                        <span className={ currentUser && l.who === currentUser.uid? 'accent3':''}>{`${l.whoData.name}`}</span>
                        {l.lastDate && `, ${formatDistanceToNow(new Date(l.lastDate.seconds * 1000), { addSuffix: true })}`}
                      </>
                    }
                  />
                </ListItem>
                { i<list.length-1 && <Divider component="li" />}
            </div>
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