
import styles from './Clean.module.scss'

import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'
import format from 'date-fns/format'
import Place from './Place';

import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Clean = ({ place, now }) => {
  const [loading, setLoading] = useState(false)
  const [clean, setClean] = useState()
  
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getLastClean = async (id) => {
    const q = query(collection(db, "cleans"), where("where", "==", id), orderBy("date", "desc"), limit(1));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)
    querySnapshot.forEach((doc) => {
      // console.log(`CLEAN: ${doc.id} => ${doc.data()}`);
      const data = doc.data()

      let theday = new Date(data.date.seconds * 1000)
      let res = formatDistanceToNow(startOfDay(theday), { addSuffix: true })
      data.distance = res

      let doomsday = addDays(theday, place.days)
      // console.log(data.text + "test: ", theday, doomsday, place.days)
      data.doomsday = format(doomsday, "yyyy-MM-dd' 'HH:mm:ss")
      data.howmany = differenceInDays(now, doomsday)

      setClean(data)
    });
  }

  useEffect(() => {
    getLastClean(place.id)
  },[])

  useEffect(() => {
    // 
  }, [now])

  return (
    <div className={styles.Space}>
      {loading ? '...' : <>
        <div className={ styles.Badge }>
          <Place {...place} />
        </div>
        {clean? <div>
          <div className={styles.Blur}>was cleaned {clean.distance} by { place.membersMap[clean.who].name }</div>
          <div>{ clean.text }</div>
          <div className={styles.MarginTop}>
            <div>
              <b className={styles.ColorAccent}>☄️ Dies irae:</b> {clean.doomsday}
            </div>
            <div>
              <b className={styles.ColorAccent3}>{ place.membersMap[clean.next].name }</b>'s 차례
              {clean.howmany <= 0 ?
                clean.howmany <= -3 ?
                <Chip sx={{ m:1 }} label={ `😎 ${clean.howmany*-1}일 남음` } color="success" />
                :
                <Chip sx={{ m:1 }} label={ clean.howmany===0? `🚨 오늘 당장!` : `😨 ${clean.howmany*-1}일 남음` } color="error" />
                
              :
                <Chip sx={{ m:1 }} label={ `💩 ${clean.howmany}일 지남` } color="neutral" />
              }
            </div>
          </div>
          
          {/* <div className={styles.MarginTop}>
            <div>💰</div>
          </div> */}

          {/* <div className={ styles.Buttons }>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>구역정보</Typography>
                <Typography paragraph>
                  { JSON.stringify(place) }
                  <div>{ place.description}</div>
                </Typography>
              </CardContent>
            </Collapse>
          </div> */}
          
        </div>
        :<div className={styles.Blur}>
          청소한 적이 없음
        </div>}
      </>
      }
    </div>
  )
}
export default Clean