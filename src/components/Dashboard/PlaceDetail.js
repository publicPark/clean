import styles from './Place.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { getDoc, doc } from "firebase/firestore"; 

import { Link, useParams } from "react-router-dom";
import Members from '../Form/Members';

import Button from '@mui/material/Button';

const PlaceDetail = ({ currentUser }) => {
  const {id} = useParams() 
  const [place, setPlace] = useState()
  const [loading, setLoading] = useState(false)

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
    }
  }

  useEffect(() => {
    if (id) {
      getPlace(id)
    }
  }, [])
  
  const getOut = () => {
    alert("아직 못나가")
  }

  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      <div className={stylesPaper.Content}>
        {loading? <div>...</div> : place?
          <>
            <div>
              <Link to={`/cleaned/${id}`}>
                <Button variant="contained">I've cleaned!</Button>
              </Link>
            </div>
            
            <div className={styles.Paper}>
              <h1>{place.name}</h1>
              <h5>CODE: {id}</h5>
              <div className={styles.Description}>{place.description}</div>
              <div>
                - Members -
                <Members members={place.members} membersMap={place.membersMap} currentUser={currentUser} />
              </div>
              <div>Limit days: <b>{place.days}일</b><br /></div>
              <div>
                <Link to={`/placeform/${id}`}><Button variant="outlined" color="secondary">Edit</Button></Link>
                <Button sx={{ ml: 2 }} variant="outlined" color="warning" onClick={ getOut }>GET OUT</Button>
              </div>
            </div>
          </>
          :
          <h1>그런 구역은 없습니다!</h1>
        }
      </div>
    </div>
  )
}

export default PlaceDetail