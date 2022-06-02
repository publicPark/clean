import styles from './Place.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { getDocs, doc, onSnapshot, query, where, collection } from "firebase/firestore"; 
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import Members from './Members';
import Voices from "../List/Voices";
import Cleans from './Cleans';
import Buttons from './Buttons';
import  { useAuth } from '../../contexts/AuthContext'
import Bottom from './Bottom';
import Description from './Description';
import Invitees from './Invitees';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PlaceDetail = ({ }) => {
  const { currentUser } = useAuth()
  let navigate = useNavigate();
  const {id} = useParams() 
  const [place, setPlace] = useState()
  const [loading, setLoading] = useState(true)
  const [userMap, setUserMap] = useState()
  
  const getUsers = async (members) => {
    const q = query(collection(db, "users"), where('id', 'in', members))
    const querySnapshot = await getDocs(q);
    let obj = {}
    querySnapshot.forEach((doc) => {
      obj[doc.id] = doc.data()
    });
    setUserMap(obj)
  }

  useEffect(() => {
    const docRef = doc(db, "places", id);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      let d = snap.data()
      // console.log(d)
      setPlace(d)
      if (d) {
        getUsers(d.members)
      }
      // 타이틀 세팅
      document.title = d.name
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot", error)
    });
    return () => unsubscribe() // 아놔..
  }, [])

  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        {loading ?
          <div className={stylesPaper.Content}><CircularProgress sx={{ mt: 2 }} color="primary" /></div> :
          place ? <>
            <Accordion
              defaultExpanded={true}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  variant="h5"
                >
                  <b>{place.name}</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.Content}>
                  <div>
                    <div className={styles.Label}>구역의 공지사항 </div>
                    <Box sx={{ mt: 1 }}>
                      <Description description={place.description} />
                    </Box>
                  </div>
                  <div>
                    <span className={styles.Label}>⏳ 최대 청소 주기(제한 기간) <br /></span><b>{place.days}</b>일
                  </div>
                  <div>
                    <div className={styles.Label}>지났을 때 벌칙 </div>
                    <div className={styles.Penalty}>
                      {place.penalty}
                    </div>
                  </div>
                  <Bottom place={place} userMap={userMap} />
                  <Buttons place={place} id={id} />
                </div>
              </AccordionDetails>
            </Accordion>
          
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  variant="body2"
                >
                  { place.members.length }명의 멤버들, 당신은 {currentUser && place.members.includes(currentUser.uid) ? '멤버' : '이방인'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.Content}>
                  {userMap && <Members members={place.members} userMap={userMap} id={ id } />}
                  <div>
                    <Invitees people={place.membersInvited} />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </>
          
          :
          <div className={stylesPaper.Content}><h1>그런 구역은 없습니다!</h1></div>
        }
      </div>

      {place && 
        <div className={stylesPaper.Wrapper}>
          <Box sx={{pt:4, pb:3}}>
            <Link to={`/cleaned/${id}`}>
              <Button variant="contained">청소했어! I've cleaned</Button>
            </Link>
          </Box>
          <div className={styles.List}>
            {place && <Cleans place={{ ...place, id: id }} userMap={userMap} />}
          </div>
        </div>
      }

      {place && 
        <div className={stylesPaper.Wrapper}>
          <Voices type={ id }/>
        </div>
      }
    </div>
  )
}

export default PlaceDetail