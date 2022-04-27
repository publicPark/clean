import { db } from '../../firebase'
import { collection, doc, getDoc, getDocs, addDoc, query, where, onSnapshot, limit, orderBy, updateDoc } from "firebase/firestore";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './Common.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
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
  const [myVoice, setMyVoice] = useState()

  const handleSay = async (e) => {
    e.preventDefault();
    if (!say) return
    
    setLoadingSubmit(true)

    if (myVoice) {
      const docRef = doc(db, "voices", myVoice);
      await updateDoc(docRef, {
        lastDate: new Date(),
        say: say
      });
    } else {
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

  // 내꺼 있나
  const getMyVoice = async () => {
    const q = query(voicesRef, where("who", "==", currentUser.uid), where("target", "==", type));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (d) => {
      setMyVoice(d.id)
    });
  }

  useEffect(() => {
    setLoading(true)
    let queryArr = [voicesRef, where("target", "==", type), orderBy("lastDate", "desc")]
    if(type==='all') queryArr.push(limit(10))
    const q = query(...queryArr);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log("voices", querySnapshot)
      let arr = []
      if(querySnapshot.size===0) setLoading(false)
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()
        const docRef = doc(db, "users", d.who);
        const userDocSnap = await getDoc(docRef);
        d.whoData = userDocSnap.data()
        arr.push(d)
        if (arr.length === querySnapshot.size) {
          setList(arr)
          setLoading(false)
        }
      });
    },
    (error) => {
      console.log("querySnapshot", error)
    });

    return () => unsubscribe() // 아놔..
  }, [type])

  useEffect(() => {
    if (currentUser) {
      getMyVoice()
    }
  }, [currentUser])
  
  return (
    <>
      <div className={stylesPaper.Content}>
        {type === 'all' ?
          <h2>청소 애호가들의 한마디</h2>
          :
          <h2>이 구역에서 한마디</h2>
        }
        
        

        { currentUser &&
          <form onSubmit={handleSay}>
            <div>
              <TextField id="standard-voice" fullWidth
                label={myVoice?`다시 한마디`:`한마디`}
                variant="standard" sx={{ mb: 1 }}
                value={ say }
                onChange={ (e)=>setSay(e.target.value) }
              />
            </div>
            <Button type="submit" variant="contained" sx={{mb:2}} color="neutral"
              onClick={handleSay} disabled={loadingSubmit}
            >
              { myVoice?'이전 것은 지워지고 SAY' : 'SAY' }
            </Button>
          </form>
        }
      </div>
      {
        loading ?
          <CircularProgress sx={{ m: 2 }} color="primary" />
        :
        list.length ?
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
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