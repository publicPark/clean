import { db } from '../../firebase'
import { Link } from "react-router-dom";
import stylesPaper from '../styles/Paper.module.scss'
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import useNotification from '../../apis/useNotification';
import { useAuth } from '../../contexts/AuthContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CheckIcon from '@mui/icons-material/Check';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const MyReadNews = ({ maxCount=4 }) => {
  const { currentUser } = useAuth()
  let navigate = useNavigate();
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const { deleteNoti } = useNotification()

  useEffect(() => {
    if (currentUser) {
      const cRef = collection(db, "notifications");
      let q = query(cRef,
        where("toRead", "array-contains", currentUser.uid),
        orderBy("date", "desc"),
        limit(maxCount));
      setLoading(true)
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        // console.log("MyReadNews", querySnapshot.size)
        let arr = []
        querySnapshot.forEach((snap) => {
          let d = snap.data()
          d.id = snap.id
          arr.push(d)
        });
        setList(arr)
        setLoading(false)
      },
      (error) => {
        console.log("querySnapshot in mynews", error)
      });

      return () => unsubscribe()
    }
  }, [currentUser])

  const print = (val) => {
    console.log(val)
  }

  const goTo = async (noti) => {
    navigate(noti.url)
  }

  const deleteNews = (noti) => {
    let remove = false
    if(noti.to.length===0 && noti.toRead.length===1) remove = true
    deleteNoti(noti, currentUser.uid, remove, true)
  }

  return (
    <List>
      {list.map((el, idx) => <ListItem key={idx}
        onDoubleClick={() => print(el)}
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={ () => deleteNews(el) }>
            <CloseIcon />
          </IconButton>
        }
        disablePadding
      >
        <ListItemButton
          alignItems="flex-start"
          onClick={() => goTo(el)} >
          <ListItemAvatar>
            <Avatar>
              <CheckIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.secondary"
            >
              { el.content }
            </Typography>
            </>}
            secondary={formatDistanceToNow(new Date(el.date.seconds * 1000), { addSuffix: true })} 
          />
        </ListItemButton>
      </ListItem> )}
      
    </List>
  )
}

export default MyReadNews