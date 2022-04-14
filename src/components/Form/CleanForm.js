import { useEffect, useState, forwardRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, addDoc, getDoc, doc, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 

import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'

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
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CleanForm = ({ currentUser }) => {
  let navigate = useNavigate();
  const { id } = useParams()
  const [value, setValue] = useState(new Date());
  const [text, setText] = useState('');
  
  const [place, setPlace] = useState()
  const [players, setPlayers] = useState([])
  const [clean, setClean] = useState()

  const [next, setNext] = useState('');
  const [penalty, setPenalty] = useState(0)

  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)

  const [err, setErr] = useState('');

  const handleChangeNext = (event) => {
    setNext(event.target.value);
  };
  const handleChangeText = (event) => {
    setText(event.target.value);
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      // alert("안 돼요! 로그인 안 하면 구경만 가능!")
      handleErr("안 돼요! 로그인 안 하면 구경만 가능!")
      return
    }

    if (!text || !next || !value) {
      // alert("다 채워야함")
      handleErr("다 채워야함")
      return
    }
    
    // console.log('value test', value)
    // return
    try {
      setPending(true)
      const docRef = await addDoc(collection(db, "cleans"), {
        who: currentUser.uid,
        where: id,
        next: next,
        date: endOfDay(value),
        text: text,
        penalty: penalty,
        created: new Date()
      });

      setPending(false)
      console.log("Document written with ID: ", docRef.id);
      navigate(-1, { replace: true });
    } catch (e) {
      setPending(false)
      console.error("Error adding document: ", e);
    }

  }

  useEffect(() => {
    getPlace()
    getLastClean()
  }, [])

  useEffect(() => {
    if (clean) {
      console.log("마지막 청소날짜", format(new Date(clean.date.seconds * 1000), "yyyy-MM-dd"))
        
      if (clean && place) {
        // 날짜 바뀔때 패널티 계산
        let penalty = 0;
        let lastday = new Date(clean.date.seconds * 1000)
        let doomsday = addDays(lastday, place.days)
        penalty = differenceInDays(endOfDay(value), doomsday) // 심판의 날이 얼마나 남았는지
        setPenalty(penalty)
      }
    }
  }, [clean, value])
  
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

  const getLastClean = async () => {
    const q = query(collection(db, "cleans"), where("where", "==", id), orderBy("date", "desc"), limit(1));
    setLoading(true)
    const querySnapshot = await getDocs(q);
    setLoading(false)
    querySnapshot.forEach((doc) => {
      // console.log(`CLEAN: ${doc.id} => ${doc.data()}`);
      const data = doc.data()
      setClean(data)
    });
  }

  function disablePrevDates() {
    if (clean) {
      const startSeconds = clean.date.seconds * 1000;
      const endSeconds = Date.parse(new Date())
      return (date) => {
        return Date.parse(date) < startSeconds || Date.parse(date) > endSeconds;
      }
    }
    return 
  }

  const handleErr = (msg) => {
    setErr(msg);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErr('');
  };
  
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      {/* <Snackbar open={err?true:false} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {err}
        </Alert>
      </Snackbar> */}
      <div className={stylesPaper.Content}>
        <form className={styles.Form} onSubmit={ onSubmit }>
          <div className={styles.Title}>
            {place && <h1>{ place.name } 청소했다!</h1>}
          </div>

          <div className={styles.Row}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                shouldDisableDate={ disablePrevDates() }
                label="When did you clean?"
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
          
          {loading ? <CircularProgress color="primary" /> : 
            <>
              <div className={styles.Result}>
                { penalty > 0 ? /* 벌점 */
                  <>
                    <div>벌칙의 무게<br /><b className={ styles.Penalty }>{penalty}</b></div>
                    <div className={styles.PenaltyContent}>
                      {place.penalty}
                    </div>
                  </>
                  :
                  <div><b className={ styles.Penalty }>잘했어요!</b></div>
                }
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
                    {players.map((u, i) => <MenuItem key={i} value={u}>{place.membersMap[u].name}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>


              <div>
                <Collapse in={err?true:false} className={ styles.Inline }>
                  {/* <Alert variant="filled" severity="error">
                    {err}
                  </Alert> */}
                  <Alert variant="filled" severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          handleClose(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >{ err }</Alert>
                </Collapse>
              </div>
              
              {pending ?
                <LoadingButton loading variant="contained">
                  ...
                </LoadingButton>
                :
                <Button type="submit" variant="contained">기록하기</Button>
              }
            </>
          }
        </form>
      </div>
    </div>
  )
}

export default CleanForm;