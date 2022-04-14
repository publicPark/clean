import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { db } from '../../firebase'
import { collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

const PlaceForm = ({ currentUser }) => {
  let navigate = useNavigate();
  let { id } = useParams();

  const [place, setPlace] = useState()
  const [amIFirst, setAmIFirst] = useState(false)

  const [loadingData, setLoadingData] = useState(false); // 수정일때 데이터 로딩
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [days, setDays] = useState();
  const [textForDelete, setTextForDelete] = useState('');
  const [loading, setLoading] = useState(false)

  const handleChangeText = (event) => {
    setText(event.target.value);
  };
  const handleChangeText2 = (event) => {
    setText2(event.target.value);
  };
  const handleChangeText3 = (event) => {
    setText3(event.target.value);
  };
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
      alert("다 채워야함")
      return
    }
    
    try {
      setLoading(true)
      if (id) {
        const docRef = doc(db, "places", id);
        await updateDoc(docRef, {
          name: text,
          days: days,
          description: text2,
          penalty: text3,
        });
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
      console.log("Document data:", data);
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
    }
  }

  // 삭제하기
  const handleDelete = async () => {
    const docRef = doc(db, "places", id);
    setLoading(true)
    if (amIFirst) {
      if (window.confirm("Do you really want to delete?")) {
        await deleteDoc(docRef);
        navigate("/", { replace: true });
      }
    } else {
      // 빼기
      alert("you are not the first")
    }
  }

  useEffect(() => {
    if (id) {
      getPlace()
    }
  }, [])

  return (
    <div>
      {loadingData ? <CircularProgress color="primary" /> : 
        <form className={styles.Form} onSubmit={ onSubmit }>
          <div className={stylesPaper.Flex}>
            <div className={stylesPaper.Wrapper}>
              <div className={stylesPaper.Content}>
                  <div className={styles.Title}>
                    {/* <h1>{ currentUser.displayName },</h1> */}
                    <h2>청소 구역 {id ? <>수정</> : <>생성</>}</h2>
                  </div>

                  <div className={styles.Row}>
                    <TextField id="outlined-basic" label="구역 이름" variant="outlined"
                    value={text} onChange={handleChangeText}/>
                  </div>

                  <div className={styles.Label}>멤버들에게 알립니다</div>
                  <div className={styles.Row}>
                    {/* <TextField id="outlined-basic" label="구역 설명" variant="outlined"
                      value={text2} onChange={handleChangeText2} /> */}
                    <TextareaAutosize className={styles.Textarea}
                      aria-label="Notice for members"
                      minRows={3}
                      placeholder="Notice for members"
                      style={{ width: 200, resize: 'none' }}
                      value={text2} onChange={handleChangeText2}
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
                    label="Days Limit"
                    placeholder='default: 14'
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={styles.Label}>위 기간이 지났을 때 벌칙</div>
                <div className={styles.Row}>
                  {/* <TextField id="outlined-basic" label="구역 설명" variant="outlined"
                    value={text2} onChange={handleChangeText2} /> */}
                  <TextareaAutosize className={styles.Textarea}
                    aria-label="penalty"
                    minRows={3}
                    placeholder="벌칙 내용 예) 1일이 지나면 1만원, N일이 지나면 N만원을 회비로 입금"
                    style={{ width: 200, resize: 'none' }}
                    value={text3} onChange={handleChangeText3}
                  />
                </div>

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
                      <div>나가려면 입력하세요. <span className={styles.Italic}>{place.name}</span> </div>
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
                          { loading ?
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