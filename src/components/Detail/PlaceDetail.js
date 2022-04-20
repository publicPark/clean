import styles from './Place.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { getDocs, doc, onSnapshot, query, where, collection } from "firebase/firestore"; 
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import Members from './Members';
import Voices from "../Dashboard/Voices";
import Cleans from './Cleans';
import usePlace from '../../apis/usePlace';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


const PlaceDetail = ({ currentUser, now }) => {
  let navigate = useNavigate();
  const {id} = useParams() 
  const [place, setPlace] = useState()
  const [loading, setLoading] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const { loading: loadingPlace, getout, deletePlace } = usePlace(id)

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

  const onShowCode = () => {
    navigator.clipboard.writeText(id)
    setShowCode((cur)=>!cur)
  }

  const getPlace = (id) => {
    const docRef = doc(db, "places", id);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      let d = snap.data()
      setPlace(d)
      getUsers(d.members)
      setLoading(false)
    },
    (error) => {
      console.log("querySnapshot", error)
    });
    return unsubscribe
  }

  useEffect(() => {
    const unsubscribe = getPlace(id)
    return () => unsubscribe() // 아놔..
  }, [id])
  
  const handleGetOut = async () => {
    if (window.confirm("Do you really want to get out? 다시 들어올 수 있어")) {
      await getout(currentUser.uid)
      getPlace(id)
    }
  }
  const handleDelete = async () => {
    if (window.confirm("Do you really want to delete?")) {
      await deletePlace()
      navigate('/', { replace: true });
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
                <code onClick={onShowCode} className={styles.Label}>
                  {showCode ?
                    <>
                      <span>Copied! </span><span className={styles.Code}>{id}</span>
                      {/* { currentUser && place.members.includes(currentUser.uid) &&
                        <Link to={ `/placejoin?code=${id}` }>
                          <Button sx={{ m: 1.5 }} variant="outlined" color="success">초대</Button>
                        </Link>
                      } */}
                    </>
                    : 'CODE?'
                  }
                </code>
                
                <div>
                  <div className={styles.Label}>멤버들에게 알립니다: </div>
                  <div className={styles.Paper}>
                    {place.description}
                  </div>
                </div>
                <div><span className={styles.Label}>Days Limit: </span><b>{place.days}</b>일<br /></div>
                <div>
                  <div className={styles.Label}>지났을 때 벌칙: </div>
                  <div className={styles.Penalty}>
                    {place.penalty}
                  </div>
                </div>
                <div>
                  <div className={styles.Label}>🧑‍🤝‍🧑 Members 🧑‍🤝‍🧑</div>
                  { userMap && <Members members={place.members} userMap={userMap} /> }
                </div>

                
                { currentUser && place.members.includes(currentUser.uid) && !loadingPlace && <div>
                  <Link to={`/placeform/${id}`}><Button variant="outlined" color="neutral">Edit</Button></Link>
                  {place.members[0] === currentUser.uid && place.members.length === 1 ?
                    <Button sx={{ ml: 2 }} variant="outlined" color="neutral" onClick={handleDelete}>GET OUT FOREVER</Button> 
                    :
                    <Button sx={{ ml: 2 }} variant="outlined" color="neutral" onClick={handleGetOut}>GET OUT</Button>
                  }
                </div>
                }

                { currentUser && !place.members.includes(currentUser.uid) &&
                  <Link to={ `/placejoin?code=${id}` }>
                    <Button sx={{ m: 1 }} variant="outlined" color="success">참가!</Button>
                  </Link>
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
          <div className={stylesPaper.Content}>
            <div className={ styles.Buttons }>
              <Link to={`/cleaned/${id}`}>
                <Button variant="contained">I've cleaned</Button>
              </Link>
            </div>
          </div>
          <div className={styles.List}>
            {place && <Cleans place={{ ...place, id: id }} now={now} userMap={userMap} />}
          </div>
        </div>
      }

      {place && 
        <div className={stylesPaper.Wrapper}>
          <div className={stylesPaper.Content}>
            <h2>이 구역에서 한마디</h2>
            <Voices type={ id }/>
          </div>
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