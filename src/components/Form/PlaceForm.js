import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'
import Members from './Members';

import { db } from '../../firebase'
import { collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';

const PlaceForm = ({ currentUser }) => {
  let navigate = useNavigate();
  let { id } = useParams();

  const [place, setPlace] = useState()
  const [amIFirst, setAmIFirst] = useState(false)

  const [loadingData, setLoadingData] = useState(false); // 수정일때 데이터 로딩
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [days, setDays] = useState();
  const [textForDelete, setTextForDelete] = useState('');
  const [loading, setLoading] = useState(false)

  const handleChangeText = (event) => {
    setText(event.target.value);
  };
  const handleChangeText2 = (event) => {
    setText2(event.target.value);
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

    if (!text) {
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
        });
      } else {
        let d = days
        if(!d) d = 14
        const docRefNew = await addDoc(collection(db, "places"), {
          name: text,
          days: d,
          description: text2,
          members: [{
            id: currentUser.uid,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL
          }],
          created: new Date()
        });
        console.log("Document written with ID: ", docRefNew.id);
      }

      setLoading(false)
      navigate("/", { replace: true });
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
      setDays(data.days)

      setPlace(data)
      if (data.members && data.members.length && data.members[0].id === currentUser.uid) {
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
      await deleteDoc(docRef);
    } else {
      // 빼기
    }
    
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (id) {
      getPlace()
    }
  }, [])

  return (
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        { loadingData ? '...' : 
          <form className={styles.Form} onSubmit={ onSubmit }>
            <div className={styles.Title}>
              {/* <h1>{ currentUser.displayName },</h1> */}
              <h2>청소 구역 {id ? <>수정</> : <>생성</>}</h2>
              {/* { place && <div>
                <Members members={ place.members } currentUser={currentUser} />
              </div>} */}
            </div>

            <div className={styles.Row}>
              <TextField id="outlined-basic" label="구역 이름" variant="outlined"
              value={text} onChange={handleChangeText}/>
            </div>
            <div className={styles.Row}>
              {/* <TextField id="outlined-basic" label="구역 설명" variant="outlined"
                value={text2} onChange={handleChangeText2} /> */}
              <TextareaAutosize
                aria-label="description"
                minRows={3}
                placeholder="description"
                style={{ width: 200, resize: 'none' }}
                value={text2} onChange={handleChangeText2}
              />
            </div>
            <div className={styles.Row}>
              <TextField
                value={days} onChange={handleChangeDays}
                id="outlined-number"
                label="limit days"
                placeholder='default: 14'
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
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
                  <div>나가는 것은 신중하게 생각하세요.<br/> 그리고 입력하세요. <span className={styles.Italic}>{place.name}</span> </div>
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
                      <LoadingButton loading variant="contained">
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
          </form>
        }
      </div>
    </div>
  )
}

export default PlaceForm;