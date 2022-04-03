import { useState } from 'react';
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { db } from '../../firebase'
import { collection, addDoc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";

const PlaceForm = ({ currentUser }) => {
  let navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false)

  const handleChangeText = (event) => {
    setText(event.target.value);
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!text) {
      alert("다 채워야함")
      return
    }
    
    try {
      setLoading(true)
      const docRef = await addDoc(collection(db, "places"), {
        name: text,
        days: 14,
        members: [currentUser.uid],
        created: new Date()
      });

      setLoading(false)
      console.log("Document written with ID: ", docRef.id);
      navigate("/", { replace: true });
    } catch (e) {
      setLoading(false)
      console.error("Error adding document: ", e);
    }

  }

  return (
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        <form className={styles.Form} onSubmit={ onSubmit }>
          <div className={styles.Title}>
            <h1>{ currentUser.displayName },</h1>
            <h2>청소 구역 생성</h2>
          </div>

          <div className={styles.Row}>
            <TextField id="outlined-basic" label="이름" variant="outlined"
            value={text} onChange={handleChangeText}/>
          </div>

          <div className={styles.Row}>
            <Divider variant="middle" />
          </div>

          {loading ?
            <LoadingButton loading variant="contained">
              ...
            </LoadingButton>
            :
            <Button type="submit" variant="contained">CREATE!</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default PlaceForm;