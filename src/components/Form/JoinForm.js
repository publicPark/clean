
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { useState, forwardRef } from 'react';
import { db } from '../../firebase'
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; 
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useSearchParams } from "react-router-dom";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Collapse from '@mui/material/Collapse';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const JoinForm = () => {
  const { currentUser } = useAuth()
  let [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code")

  let navigate = useNavigate();
  const [text, setText] = useState(code || '');
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setErr("모르십니까?")
      return
    }

    if (!currentUser) {
      setErr("로그인하고 다시")
      return
    }
    
    // update
    const docRef = doc(db, "places", text);
    setLoading(true)
    const docSnap = await getDoc(docRef);
    setLoading(false)
    if (docSnap.exists()) {
      let data = docSnap.data()
      console.log("Document data:", data);
      let isIn = false
      for (let i = 0; i < data.members.length; i++){
        if (data.members[i] === currentUser.uid) { // 이미 있으면
          isIn = true
          break
        }
      }
      if (isIn) {
        setErr("당신은 이미 join")
      } else {
        data.membersMap[currentUser.uid] = {
          id: currentUser.uid,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL
        }
        setLoading(true)
        await updateDoc(docRef, {
          members: arrayUnion(currentUser.uid),
          membersMap: data.membersMap
        });
        setLoading(false)
        navigate(-1, { replace: true });
      }
      
    } else {
      setErr("그런 구역은 없습니다.")
    }
  }
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      <div className={stylesPaper.Content}>
        <form className={styles.Form} onSubmit={onSubmit}>
          <div className={styles.Title}>
            <h2>{ code? '참가하시겠습니까?' : '코드를 아십니까?' }</h2>
          </div>
          {!code && 
          <div className={styles.Row}>
            <TextField id="outlined-code" label="Code" variant="outlined"
            value={text} onChange={(e)=>setText(e.target.value)}/>
          </div>
          }
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
                      setErr('')
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >{ err }</Alert>
            </Collapse>
          </div>
          {loading ?
            <LoadingButton loading variant="contained">
              ...
            </LoadingButton>
            :
            <Button type="submit" variant="contained">JOIN!</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default JoinForm;