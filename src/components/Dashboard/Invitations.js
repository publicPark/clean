import { useEffect, useState } from "react"
import { db } from '../../firebase'
import { collection, query, where, limit, onSnapshot } from "firebase/firestore"; 
import { useAuth } from '../../contexts/AuthContext';
import stylesPaper from '../styles/Paper.module.scss'

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";


const placesRef = collection(db, "places");
const Invitations = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    let q = query(placesRef, where("test", "==",  true));
    if (currentUser) {
     q = query(placesRef, where("membersInvited", "array-contains", currentUser.uid));
    }
    setLoading(true)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot invitations", querySnapshot)
      let list = []
      querySnapshot.forEach(async (snap) => {
        let d = snap.data()
        list.push({...d, id:snap.id})
      });
      setList(list)
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot invitations", error)
    });

    return () => unsubscribe()
  },[])
  return ( list && list.length>0 &&
    
    <Stack spacing={1}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>초대장이 도착했어요 💌</h2>
          {list.map(el => <>
            <Card sx={{ minWidth: 250, textAlign:'left' }}>
              <CardContent>
                <Typography gutterBottom>
                  <Link to={`/place/${el.id}`}>{el.name}</Link>
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                  ⌛ 최대 청소 주기: {el.days}일
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">초대 수략하기</Button>
                <Button size="small">거절하기</Button>
              </CardActions>
            </Card>
          </>)}
        </div>
      </div>
  </Stack>
  )
}

export default Invitations