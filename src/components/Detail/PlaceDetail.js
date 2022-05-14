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
import usePlace from '../../apis/usePlace';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Description from './Description';
import { Box } from '@mui/system';

const PlaceDetail = ({ currentUser, now }) => {
  let navigate = useNavigate();
  const {id} = useParams() 
  const [place, setPlace] = useState()
  const [loading, setLoading] = useState(true)
  const { loading: loadingPlace, getout } = usePlace(id)

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
  
  const handleGetOut = async () => {
    if (window.confirm("Do you really want to get out? 다시 들어올 수 있어요.")) {
      try {
        await getout(id, currentUser.uid)
      } catch (err) {
        alert(err)
      }
    }
  }

  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          {loading? <CircularProgress sx={{ mt: 2 }} color="primary" /> : place?
            <>
              <div className={styles.Content}>
                <div className={ styles.Title }>{place.name}</div>
                
                <div>
                  <div className={styles.Label}>⭐ 구역의 공지사항 </div>
                  <Box sx={{mt:1}}>
                    <Description description={place.description}/>
                  </Box>
                  {/* <div className={styles.Paper}>
                    {place.description}
                  </div> */}
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
                <div>
                  <div className={styles.Label}>멤버들 </div>
                  { userMap && <Members members={place.members} userMap={userMap} /> }
                </div>
                
                {currentUser &&
                  (
                    !place.members.includes(currentUser.uid) &&
                    <Link to={ `/placejoin?code=${id}` }>
                      <Button sx={{ m: 1 }} variant="contained" color="primary">참가하기! JOIN!</Button>
                    </Link>
                  ) 
                }
                
                {currentUser && place.members.includes(currentUser.uid) && !loadingPlace && <div>
                  <>
                    <Link to={`/invite/${id}`}>
                      <Button variant="outlined" color="info">초대하기</Button>
                    </Link>
                    <Link to={`/placeform/${id}`}>
                      <Button sx={{ ml: 1 }} variant="outlined" color="neutral">수정하기</Button>
                    </Link>
                  </>
                  {place.members[0] === currentUser.uid && place.members.length === 1 ?
                    <Link to={`/placeform/${id}`}>
                      <Button sx={{ ml: 1 }} variant="outlined" color="neutral">영원히 나가고 삭제</Button>
                    </Link>
                    :
                    <Button sx={{ ml: 1 }} variant="outlined" color="neutral" onClick={handleGetOut}>나가기</Button>
                  }
                </div>
                }
              </div>
            </>
            :
            <h1>그런 구역은 없습니다!</h1>
          }
        </div>
      </div>


      {place && 
        <div className={stylesPaper.Wrapper}>
          <Box sx={{pt:4, pb:3}}>
            <Link to={`/cleaned/${id}`}>
              <Button variant="contained">청소했어! I've cleaned</Button>
            </Link>
          </Box>
          <div className={styles.List}>
            {place && <Cleans place={{ ...place, id: id }} now={now} userMap={userMap} />}
          </div>
        </div>
      }

      {place && 
        <div className={stylesPaper.Wrapper}>
          <Voices type={ id }/>
        </div>
      }

      {/* <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <span className={ stylesPaper.Blur }>
            {place && place.modified &&
              <>
                <span>{ `modified by ${userMap ? userMap[place.modifier].name : ''} ${formatDistanceToNow(new Date(place.modified.seconds * 1000), { addSuffix: true })}` }</span>
                <br />
              </>
            }
            {place && place.created &&
              `created ${format(new Date(place.created.seconds * 1000), "yyyy-MM-dd")}`
            }
          </span>
        </div>
      </div> */}
    </div>
  )
}

export default PlaceDetail