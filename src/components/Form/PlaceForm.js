import { useEffect, useState, forwardRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { db } from '../../firebase'
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore"; 
import ConfirmDialog from '../Utils/ConfirmDialog';
import useNotification from '../../apis/useNotification';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import usePlace from '../../apis/usePlace';
import Collapse from '@mui/material/Collapse';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PlaceForm = ({ currentUser }) => {
  let navigate = useNavigate();
  let { id } = useParams();
  const { loading: loadingPlace, deletePlace } = usePlace()
  const [openDelete, setOpenDelete] = useState(false)
  const { sendNoti } = useNotification()

  const [place, setPlace] = useState()
  const [amIFirst, setAmIFirst] = useState(false)

  const [loadingData, setLoadingData] = useState(false); // 수정일때 데이터 로딩
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [days, setDays] = useState();
  const [textForDelete, setTextForDelete] = useState('');
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleChangeDays = (event) => {
    setDays(event.target.value);
  };
  const handleChangeTextForDelete = (event) => {
    setTextForDelete(event.target.value);
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!text || !text2 || !text3) {
      setErr("다 채워주세요")
      return
    }

    if (days <= 0) { 
      setErr("Days Limit 청소할 시간을 주세요")
      return
    }
    
    try {
      setLoading(true)
      if (id) {
        // 수정일 때
        let arr_changed = []
        if(place.name!==text){
          arr_changed.push(`구역 이름이 변경되었어요! (${place.name} 👉 ${text})`)
        }
        if(place.description!==text2){
          arr_changed.push(`⭐ 공지사항이 변경되었으니 살펴보세요!`)
        }
        if(place.days!==days){
          arr_changed.push(`⏳ 최대 청소 주기가 변경되었어요! (${place.days}일 👉 ${days}일)`)
        }
        if(place.penalty!==text3){
          arr_changed.push(`💰 벌칙이 변경되었으니 살펴보세요!`)
        }
        if(arr_changed.length>0){ // 변경사항이 있으면
          let str_arr = ""
          arr_changed.forEach(row => {
            str_arr +=  "\n" + row
          });
          // 알림 보내기
          await sendNoti(
            'district-changed',
            place.members,
            `/place/${place.id}`,
            `[구역 변경]${str_arr}`
          )

          const docRef = doc(db, "places", id);
          await updateDoc(docRef, {
            name: text,
            days: days,
            description: text2,
            penalty: text3,
            modifier: currentUser.uid,
            modified: new Date()
          });
        }else{
          setErr("변경 사항이 없습니다.")
          setLoading(false)
          return
        }
      } else {
        let d = days
        if (!d) d = 14
        let newData = {
          name: text,
          days: d,
          description: text2,
          penalty: text3,
          members: [currentUser.uid],
          created: new Date()
        }
        const map = {} // 맵이 지원이 안되네? 그럼 그냥 Dictionary
        map[currentUser.uid] = {
          id: currentUser.uid,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL
        }
        newData.membersMap = map
        const docRefNew = await addDoc(collection(db, "places"), newData);
        console.log("Document written with ID: ", docRefNew.id);
      }

      setLoading(false)
      navigate(-1, { replace: true });
    } catch (e) {
      setLoading(false)
      console.error("Error adding document: ", e);
    }
  }

  // 수정일때 정보 불러오기
  const getPlace = async () => {
    const docRef = doc(db, "places", id);
    setLoadingData(true)
    const docSnap = await getDoc(docRef);
    setLoadingData(false)
    if (docSnap.exists()) {
      let data = docSnap.data()
      // console.log("Document data:", data);
      setText(data.name)
      setText2(data.description)
      setText3(data.penalty)
      setDays(data.days)

      setPlace(data)
      if (data.members && data.members.length && data.members[0] === currentUser.uid) {
        setAmIFirst(true)
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      navigate("/", { replace: true });
    }
  }

  // 삭제하기
  const handleDelete = async () => {
    if (amIFirst) {
      setOpenDelete(true)
    } else {
      // 빼기
      setErr("You can't! You are not the owner.")
    }
  }
  const handleDeleteForever = async () => {
    await deletePlace(id)
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (id) {
      getPlace()
    }
  }, [])

  return (
    <div>
      {loadingData ? <CircularProgress color="primary" /> : 
        <form className={styles.Form} onSubmit={onSubmit}>
          <ConfirmDialog
            msg1="Do you really want to delete?"
            msg2="영원히 삭제하시겠습니까?"
            open={openDelete}
            setOpen={setOpenDelete}
            callback={handleDeleteForever}
          />
          <div className={stylesPaper.Flex}>
            <div className={stylesPaper.Wrapper}>
              <div className={stylesPaper.Content}>
                  <div className={styles.Title}>
                    {/* <h1>{ currentUser.displayName },</h1> */}
                    <h2>청소 구역 {id ? <>수정</> : <>생성</>}</h2>
                  </div>

                  <div className={styles.Row}>
                    <TextField id="outlined-district" label="구역 이름" variant="outlined"
                    value={text} onChange={(e) => { setText(e.target.value )}}/>
                  </div>

                  <div className={styles.Label}>⭐ 구역의 공지사항</div>
                  <div className={styles.Row}>
                    <TextareaAutosize className={styles.Textarea}
                      aria-label="Rules"
                      minRows={3}
                      placeholder="Rules"
                      style={{ width: 200, resize: 'none' }}
                      value={text2} onChange={(e) => { setText2(e.target.value )}}
                    />
                  </div>
              </div>
            </div>

            <div className={stylesPaper.Wrapper}>
              <div className={stylesPaper.Content}>
                <div className={styles.Title}></div>
                <div className={styles.Row}>
                  <TextField
                    value={days} onChange={handleChangeDays}
                    id="outlined-number"
                    label="⏳ 최대 청소 주기(제한 기간)"
                    placeholder='default: 14'
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={styles.Label}>💰 위 기간이 지났을 때 벌칙</div>
                <div className={styles.Row}>
                  <TextareaAutosize className={styles.Textarea}
                    aria-label="penalty"
                    minRows={3}
                    placeholder="벌칙 내용 예) 1일이 지나면 1만원, N일이 지나면 N만원을 회비로 입금"
                    style={{ width: 200, resize: 'none' }}
                    value={text3} onChange={(e) => { setText3(e.target.value )}}
                  />
                </div>

                <Collapse in={err?true:false}>
                  <Alert variant="filled" severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setErr('')
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mt: 2 }}
                  >{ err }</Alert>
                </Collapse>

                <div className={styles.Row}>
                  {loading ?
                    <LoadingButton loading variant="contained">
                      ...
                    </LoadingButton>
                    :
                    <Button type="submit" variant="contained">{ id? "EDIT!": "CREATE!"}</Button>
                  }
                </div>
                
                { id && place &&
                  <>
                    <div className={styles.Row}>
                      <Divider variant="middle" />
                    </div>
                    <div className={ styles.FormGroup }>
                    <div>영원히 삭제하려면 입력하세요<br />
                      <span className={styles.Italic}>{place.name}</span>
                    </div>
                      <div>
                        <TextField 
                        value={textForDelete} onChange={handleChangeTextForDelete}
                        hiddenLabel
                        id="filled-hidden-label-small"
                        variant="filled"
                        size="small"
                        placeholder={place.name}
                        />
                        <div>
                          { loading || loadingPlace ?
                          <LoadingButton loading variant="contained" sx={{ mt: 1 }}>
                            ...
                          </LoadingButton>
                          :
                          <Button onClick={ handleDelete } sx={{mt:1}}
                            variant="contained" disabled={textForDelete !== place.name}>DELETE</Button>
                          }
                        </div>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  )
}

export default PlaceForm;