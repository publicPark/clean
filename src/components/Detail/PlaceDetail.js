import styles from './Place.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { getDoc, doc } from "firebase/firestore"; 

import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router';
import Members from './Members';

import Button from '@mui/material/Button';
import Cleans from './Cleans';
import usePlace from '../../apis/usePlace';

const PlaceDetail = ({ currentUser, now }) => {
  let navigate = useNavigate();
  const {id} = useParams() 
  const [place, setPlace] = useState()
  const [loading, setLoading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const { loading: loadingPlace, getout, deletePlace } = usePlace(id)

  const onShowCode = () => {
    navigator.clipboard.writeText(id)
    setShowCode((cur)=>!cur)
  }

  const getPlace = async (id) => {
    const docRef = doc(db, "places", id);
    setLoading(true)
    const docSnap = await getDoc(docRef);
    setLoading(false)
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let data = docSnap.data()

      setPlace(data)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setPlace()
    }
  }

  useEffect(() => {
    console.log("place detail")
    if (id) {
      getPlace(id)
    }
  }, [])
  
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
          {loading? <div>...</div> : place?
            <>
              <div className={styles.Content}>
                <div className={ styles.Title }>{place.name}</div>
                <code onClick={onShowCode} className={styles.Label}>
                  {showCode ?
                    <>
                      <span>Copied! </span><span className={styles.Code}>{id}</span>
                      { currentUser && !place.members.includes(currentUser.uid) &&
                        <Link to={ `/placejoin?code=${id}` }>
                          <Button sx={{ m: 1 }} variant="outlined" color="success">참가!</Button>
                        </Link>
                      }
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
                <div><span className={styles.Label}>Days Limit: </span><b>{place.days}일</b><br /></div>
                <div>
                  <div className={styles.Label}>지났을 때 벌칙: </div>
                  <div className={styles.Penalty}>
                    {place.penalty}
                  </div>
                </div>
                <div>
                  <div className={styles.Label}>- Members -</div>
                  <Members members={place.members} membersMap={place.membersMap} currentUser={currentUser} />
                </div>

                { currentUser && place.members.includes(currentUser.uid) && !loadingPlace && <div>
                  <Link to={`/placeform/${id}`}><Button variant="outlined" color="neutral">Edit</Button></Link>
                  {place.members[0] === currentUser.uid && place.members.length === 1 ?
                    <Button sx={{ ml: 2 }} variant="outlined" color="neutral" onClick={handleDelete}>GET OUT FOREVER</Button> 
                    :
                    <Button sx={{ ml: 2 }} variant="outlined" color="neutral" onClick={handleGetOut}>GET OUT</Button>
                  }
                </div>}
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
            {place && <Cleans place={{ ...place, id: id }} now={ now }/>}
          </div>
        </div>
      }
    </div>
  )
}

export default PlaceDetail