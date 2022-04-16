
import styles from './CleanForm.module.scss'
import stylesPaper from '../styles/Paper.module.scss'

import { useState } from 'react';
import { db } from '../../firebase'
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; 

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router';
import { useSearchParams } from "react-router-dom";

const JoinForm = ({ currentUser }) => {
  let [searchParams, setSearchParams] = useSearchParams();

  let navigate = useNavigate();
  const [text, setText] = useState(searchParams.get("code") || '');
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      alert("모르십니까?")
      return
    }
    
    // update
    const docRef = doc(db, "places", text);
    const docSnap = await getDoc(docRef);
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
        alert("이미 join")
      } else {
        data.membersMap[currentUser.uid] = {
          id: currentUser.uid,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL
        }
        await updateDoc(docRef, {
          members: arrayUnion(currentUser.uid),
          membersMap: data.membersMap
        });
        navigate("/", { replace: true });
      }
      
    } else {
      alert("그런 구역은 없습니다.")
    }
  }
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      <div className={stylesPaper.Content}>
        <form className={styles.Form} onSubmit={onSubmit}>
          <div className={styles.Title}>
            <h2>코드를 아십니까?</h2>
          </div>
          <div className={styles.Row}>
            <TextField id="outlined-basic" label="Code" variant="outlined"
            value={text} onChange={(e)=>setText(e.target.value)}/>
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