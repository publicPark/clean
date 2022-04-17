import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import PlaceButtons from "./PlaceButtons";
import LastClean from "./LastClean";
import CircularProgress from '@mui/material/CircularProgress';

const placesRef = collection(db, "places");

const Places = ({ currentUser, now }) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showButton, setShowButton] = useState(false)

  const getTestData = async () => {
    const q = query(placesRef, where("test", "==",  true));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)
    let arr = []
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      arr.push({ ...doc.data(), id: doc.id })
    });
    setList(arr)
  }
  
  // 구역 가져오기
  const getData = async () => {
    const q = query(placesRef, where("members", "array-contains", currentUser.uid), limit(5));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)
    let arr = []
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      arr.push({ ...doc.data(), id: doc.id })
    });
    setList(arr)
  }

  useEffect(() => {
    if (currentUser) {
      getData()
    }else{
      getTestData()
    }
  }, [currentUser])

  return (
    <>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          {loading ?
            <CircularProgress color="primary" />
            :
            <>
              <PlaceButtons currentUser={currentUser} list={list} />
              {list.length >= 5 && '최대 5개만 표시됩니다.'}
            </>
          }
        </div>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {list.map((p, i) => <div key={i}>
            <ListItem alignItems="flex-start">
              <LastClean place={p} currentUser={currentUser} now={ now }/>
            </ListItem>
            { i<list.length-1 && <Divider component="li" />}
          </div>)}
        </List>
      </div>
    </>
  )
}

export default Places