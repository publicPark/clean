import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import { db } from '../../firebase'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; 
import Alerts from './Alerts'

import usePlace from "../../apis/usePlace";
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import useEmail from "../../apis/useEmail"
import Description from '../Detail/Description';

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
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';


const CleanForm = ({ currentUser }) => {
  let navigate = useNavigate();
  const { id } = useParams()
  const { loading, getLastClean, getPlace } = usePlace()
  const [value, setValue] = useState(new Date());
  const [text, setText] = useState('');
  
  const [place, setPlace] = useState()
  const [players, setPlayers] = useState([])
  const [clean, setClean] = useState()

  const [next, setNext] = useState('');
  const [judgement, setJudgement] = useState(0)

  const [pending, setPending] = useState(false)

  const [userMap, setUserMap] = useState()
  const { sendCleanNews } = useEmail()

  const [errMsg, setErrMsg] = useState('')
  const [warnMsg, setWarnMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [checked, setChecked] = useState(false)
  
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

    if (!checked) {
      handleErr("구역의 공지사항을 확인했나요?")
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
      if (clean) { // 다음 타자가 있을 때 저장
        obj.target = clean.next
      }
      const docRef = await addDoc(collection(db, "cleans"), obj);

      console.log("Document written with ID: ", docRef.id);

      // 메일 보내기
      await sendCleanNews({
        place_name: place.name,
        place_id: place.id,
        to_email: userMap[next].email,
        to_name: userMap[next].name,
        from_name: userMap[currentUser.uid].name,
        message: text,
        // reply_to: userMap[currentUser.uid].email,
      })

      setPending(false)
      navigate(-1, { replace: true });
    } catch (e) {
      setPending(false)
      console.error("Error adding document: ", e);
    }
  }

  const initClean = async () => {
    const d= await getPlace(id)
    setPlace(d)
    setPlayers(d.members)
    getUsers(d.members)
    const cl = await getLastClean(id)
    setClean(cl)
  }
  
  //
  useEffect(() => {
    initClean(id)
  }, [])

  useEffect(() => {
    if (currentUser && place && !place.members.includes(currentUser.uid)){
      setSuccessMsg("당신은 멤버가 아닌데 청소를 하신다고요? 막지 않겠어요.")
    }
    if (currentUser && clean && clean.next !== currentUser.uid) {
      setSuccessMsg("당신은 차례가 아닌데 청소를 하신다고요? 청소 애호가!")
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
      setWarnMsg(msg);
    } else {
      setWarnMsg('')
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
    setErrMsg(msg);
  };
  
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
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

          {place && <Description
            description={place.description}
            checked={checked}
            handleChange={ (e)=>setChecked(e.target.checked) }
          />}
          
          <div className={styles.Row}>
            {/* <TextField id="outlined-text" label="메모" variant="outlined"
            value={text} onChange={handleChangeText}/> */}
            <TextareaAutosize className={styles.Textarea}
              aria-label="좀 더 넓은 메모"
              minRows={3}
              placeholder="메모"
              style={{ width: 200, resize: 'none' }}
              value={text} onChange={handleChangeText}
            />
          </div>
          
          {loading ? <CircularProgress color="primary" /> : 
            <>
              <div className={styles.Result}>
                { judgement > 0 ? /* 벌점 */
                  <div className={styles.Penalty}>
                    <div>
                      <div className={styles.Label}>심판 결과(심판의 무게)</div>
                      <div className={styles.Value}>
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

              <Alerts
                errMsg={errMsg} warnMsg={warnMsg} successMsg={successMsg}
                setErrMsg={setErrMsg} setWarnMsg={setWarnMsg} setSuccessMsg={setSuccessMsg}
              />
              
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