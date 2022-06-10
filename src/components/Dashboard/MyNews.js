import { db } from '../../firebase'
import { Link } from "react-router-dom";
import stylesPaper from '../styles/Paper.module.scss'
import { collection, query, orderBy, limit, doc, onSnapshot, getDoc, where } from "firebase/firestore"; 
import { useEffect, useState, cloneElement } from 'react';
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import useNotification from '../../apis/useNotification';
import { useAuth } from '../../contexts/AuthContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const MyNews = ({ maxCount=4 }) => {
  const { currentUser } = useAuth()
  let navigate = useNavigate();
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [dense, setDense] = useState(false);
  const { deleteNoti, readNoti } = useNotification()

  useEffect(() => {
    const cRef = collection(db, "notifications");
    let q = query(cRef,
      where("to", "array-contains", currentUser.uid),
      orderBy("date", "desc"),
      limit(maxCount));
    setLoading(true)
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      // console.log("mynews", querySnapshot.size)
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
  }, [])

  const print = (val) => {
    console.log(val)
  }

  const goTo = async (noti) => {
    console.log(noti)
    await readNoti(noti.id, currentUser.uid)
    navigate(noti.url)
  }

  const deleteNews = (id) => {
    console.log("del", id)
    deleteNoti(id, currentUser.uid)
  }

  return (
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        <h2>✨ 내게 온 소식 (공사 중)</h2>
        <Typography
          component="span"
          variant="body2"
          color="text.primary"
        >
          이 마을의 비밀요원은 공사 현장에 잠입 가능
        </Typography>
        {loading && <CircularProgress color="primary" />}
      </div>
      {!loading && list && (
        list.length === 0 ? 
          <Demo
            sx={{ p:2 }}
          >
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
            >
              깨끗해요 ✨
            </Typography>
          </Demo>
        :
        <Demo>
          <List dense={dense}>
            {list.map((el, idx) => <ListItem key={idx}
              onDoubleClick={() => print(el)}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={ () => deleteNews(el.id) }>
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
                    <ChatBubbleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    { el.content }
                  </Typography>
                  </>}
                  secondary={formatDistanceToNow(new Date(el.date.seconds * 1000), { addSuffix: true })} 
                />
              </ListItemButton>
            </ListItem> )}
            
          </List>
        </Demo>
      )}
    </div>
  )
}

export default MyNews