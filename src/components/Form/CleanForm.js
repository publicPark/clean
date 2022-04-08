import { useEffect, useState } from 'react';
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { db } from '../../firebase'
import { collection, addDoc, getDocs, query, where, getDoc, doc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from "react-router-dom";

const CleanForm = ({ currentUser }) => {
  let navigate = useNavigate();
  const { id } = useParams()
  const [value, setValue] = useState(new Date());
  const [text, setText] = useState('');
  
  const [place, setPlace] = useState()
  const [players, setPlayers] = useState([])

  const [next, setNext] = useState('');

  const [loading, setLoading] = useState(false)

  const handleChangeNext = (event) => {
    setNext(event.target.value);
  };
  const handleChangeText = (event) => {
    setText(event.target.value);
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!text || !next || !value) {
      alert("다 채워야함")
      return
    }
    
    try {
      setLoading(true)
      const docRef = await addDoc(collection(db, "cleans"), {
        who: currentUser.uid,
        where: id,
        next: next,
        date: value,
        text: text,
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

  useEffect(() => {
    getPlace()
  }, [])

  const getPlace = async () => {
    if (id) {
      const docRef = doc(db, "places", id);
      const docSnap = await getDoc(docRef);
      setPlace()
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let data = docSnap.data()
        setPlace(data)
        setPlayers(data.members)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
  }

  return (
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        <form className={styles.Form} onSubmit={ onSubmit }>
          <div className={styles.Title}>
            {place && <h1>{ place.name }</h1>}
            <h2>깨끗해!</h2>
          </div>

          <div className={styles.Row}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="When"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <div className={styles.Row}>
            <TextField id="outlined-basic" label="메모" variant="outlined"
            value={text} onChange={handleChangeText}/>
          </div>
          
          <div className={styles.Row}>
            <Divider variant="middle" />
          </div>
          
          <div className={styles.Row}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="demo-simple-select-label">Next Player</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={next}
                label="Next Player"
                onChange={handleChangeNext}
              >
                {players.map((u, i) => <MenuItem key={i} value={u.id}>{u.name}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          
          {loading ?
            <LoadingButton loading variant="contained">
              ...
            </LoadingButton>
            :
            <Button type="submit" variant="contained">TOUCH!</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default CleanForm;