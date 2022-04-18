import { useEffect, useState, forwardRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, addDoc, onSnapshot, doc, getDocs, query, where, orderBy, limit } from "firebase/firestore"; 

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
  const [judgement, setJudgement] = useState(0)

  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)

  const [err, setErr] = useState('');
  const [err2, setErr2] = useState('');
  const [err3, setErr3] = useState('');

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
      handleErr("안 돼요! 로그인 안 하면 구경만 가능!")
      return
    }

    if (!text || !next || !value) {
      handleErr("다 채워야함")
      return
    }
    
    // console.log('value test', value)
    // return
    try {
      setPending(true)
      let obj = {
        who: currentUser.uid,
        where: id,
        next: next,
        date: endOfDay(value),
        text: text,
        judgement: judgement,
        created: new Date()
      }
      if (clean) {
        obj.target = clean.next
      }
      const docRef = await addDoc(collection(db, "cleans"), obj);

      setPending(false)
      console.log("Document written with ID: ", docRef.id);
      navigate(-1, { replace: true });
    } catch (e) {
      setPending(false)
      console.error("Error adding document: ", e);
    }
  }

  const getPlace = (id) => {
    const docRef = doc(db, "places", id);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      let d = snap.data()
      setPlace(d)
      setPlayers(d.members)
      getUsers(d.members)
    },
    (error) => {
      console.log("querySnapshot", error)
    });
    return unsubscribe
  }

  const getLastClean = async (id) => {
    const q = query(collection(db, "cleans"),
      where("where", "==", id),
      orderBy("date", "desc"),
      orderBy("created", "desc"),
      limit(1)
    );
    setLoading(true)
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(`CLEAN: ${doc.id} => ${doc.data()}`);
      const data = doc.data()
      setClean(data)
    });
    setLoading(false)
  }

  //
  useEffect(() => {
    const unsub = getPlace(id)
    getLastClean(id)
    return () => unsub()
  }, [id])

  useEffect(() => {
    if (currentUser && place && !place.members.includes(currentUser.uid)){
      setErr3("당신은 멤버가 아닌데 청소를 하신다고요? 막지 않겠어요.")
    }
    if (currentUser && clean && clean.next !== currentUser.uid) {
      setErr3("당신은 차례가 아닌데 청소를 하신다고요? 청소 애호가!")
    }
  }, [currentUser, place, clean])

  useEffect(() => {
    if (clean && place) {
      console.log("마지막 청소날짜", format(new Date(clean.date.seconds * 1000), "yyyy-MM-dd"))
      // 날짜 바뀔때 패널티 계산
      let judgement = 0;
      let lastday = endOfDay(new Date(clean.date.seconds * 1000))
      let doomsday = addDays(lastday, place.days)
      judgement = differenceInDays(endOfDay(value), doomsday) // 심판의 날이 얼마나 남았는지
      setJudgement(judgement)
    }

    if (format(new Date(value), "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")) {
      let msg = '청소 날짜를 늦게 기록하면 다음 사람에게 피해를 줄 수 있어요!'
      setErr2(msg);
    } else {
      setErr2('')
    }
  }, [value, place, clean])

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
                { judgement > 0 ? /* 벌점 */
                  <div className={styles.Penalty}>
                    <div>
                      <div className={styles.Label}>심판 결과(심판의 무게)</div>
                      <div>
                        <b className={styles.Judgement}>{judgement}일</b>
                      </div>
                    </div>
                    <div>
                      <div className={styles.Label}>심판 대상</div>
                      <div className={styles.Value}>
                        <b>{userMap && userMap[clean.next] && userMap[clean.next].name} </b>
                        <b className="accent">
                          {currentUser && clean.next === currentUser.uid && '(나)'}
                        </b>
                      </div>
                    </div>
                    <div>
                      <div className={styles.Label}>벌칙</div>
                      <div>{place.penalty}</div>
                    </div>
                    
                  </div>
                  :
                  <>
                    <div><b className={ styles.Judgement2 }>잘했어요!</b></div>
                  </>
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
                    {players.map((u, i) => <MenuItem key={i} value={u}>{ userMap && userMap[u] ? userMap[u].name : ''}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>


              <div>
                <Collapse in={err?true:false} className={ styles.Inline }>
                  <Alert variant="filled" severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setErr('');
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >{ err }</Alert>
                </Collapse>
              </div>
              <div>
                <Collapse in={err2?true:false} className={ styles.Inline }>
                  <Alert variant="filled" severity="warning"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setErr2('');
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >{ err2 }</Alert>
                </Collapse>
              </div>

              <div>
                <Collapse in={err3?true:false} className={ styles.Inline }>
                  <Alert variant="filled" severity="success"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setErr3('');
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >{ err3 }</Alert>
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