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
import { blue, green, red, yellow } from '@mui/material/colors';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import CheckIcon from '@mui/icons-material/Check';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const MyNews = ({ maxCount=10 }) => {
  const { currentUser } = useAuth()
  let navigate = useNavigate();
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const { deleteNoti, readNoti } = useNotification()

  useEffect(() => {
    const cRef = collection(db, "notifications");
    let today = new Date()
    today.setMonth(today.getMonth()-1) // 한달전
    let q = query(cRef,
      where("to", "array-contains", currentUser.uid),
      where("date", ">=", today),
      orderBy("date", "desc"),
      limit(maxCount)
    );
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

    // 오래된 노티 불러오기
    let q2 = query(cRef,
      where("date", "<", today),
      orderBy("date", "desc")
    );
    setLoading(true)
    const unsubscribe2 = onSnapshot(q2, async (querySnapshot) => {
      // console.log("AllOldNews", querySnapshot.size)
      querySnapshot.forEach((snap) => {
        let d = snap.data()
        d.id = snap.id
        deleteOldNews(d)
      });
    },
    (error) => {
      console.log("querySnapshot in all old news", error)
    });

    return () => {
      unsubscribe()
      unsubscribe2()
    }
  }, [])

  const print = (val) => {
    console.log(val)
  }

  const goTo = async (noti) => {
    console.log(noti)
    navigate(noti.url)
    await readNoti(noti.id, currentUser.uid)
  }

  const deleteNews = (noti) => {
    deleteNoti(noti, currentUser.uid, false)
  }

  const deleteOldNews = (noti) => {
    deleteNoti(noti, currentUser.uid, true)
  }

  return (
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        <h2>✨ 내게 들려온 소식</h2>
        <Typography
          component="span"
          variant="body2"
          color="text.primary"
        >
          최근 한달 동안의 소식
        </Typography>
        {loading && <CircularProgress color="primary" />}
      </div>
      {!loading && list && (
        list.length === 0 ? 
          <Demo
            sx={{ p:3 }}
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
          <List>
            {list.map((el, idx) => <ListItem key={idx}
              onMouseEnter={ ()=>print(el) }
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={ () => deleteNews(el) }>
                  <CloseIcon />
                </IconButton>
              }
              disablePadding
            > 
            {el.toRead && el.toRead.includes(currentUser.uid)?
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
              :
              <ListItemButton
                alignItems="flex-start"
                onClick={() => goTo(el)} >
                <ListItemAvatar>
                  {el.type==='voice-district' ?
                  <Avatar sx={{ bgcolor: green[500] }}>
                    <ChatBubbleIcon />
                  </Avatar>
                  :
                  el.type==='district-clap' ?
                  <Avatar sx={{ bgcolor: yellow[600] }}>
                    <HandshakeIcon />
                  </Avatar>
                  :
                  el.type==='clean' ?
                  <Avatar sx={{ bgcolor: blue[600] }}>
                    <CleaningServicesIcon />
                  </Avatar>
                  :
                  el.type==='objection' ?
                  <Avatar sx={{ bgcolor: red[600] }}>
                    <CrisisAlertIcon />
                  </Avatar>
                  :
                  <Avatar sx={{ bgcolor: yellow[600] }}>
                    <NewReleasesIcon />
                  </Avatar>
                  }
                </ListItemAvatar>
                <ListItemText
                  primary={<>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    whiteSpace="pre-line"  
                  >
                    { el.content }
                  </Typography>
                  </>}
                  secondary={formatDistanceToNow(new Date(el.date.seconds * 1000), { addSuffix: true })} 
                />
              </ListItemButton>
            }
            </ListItem>
            )}
          </List>
        </Demo>
      )}
    </div>
  )
}

export default MyNews