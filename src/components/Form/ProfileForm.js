import { useRef, useState, forwardRef, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import stylesPaper from '../styles/Paper.module.scss'
import styles from './Form.module.scss'

import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { storage } from "../../firebase"
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfileForm = () => {
  const { currentUser:user, userUpdate } = useAuth()
  const [imgFile, setImgFile] = useState()
  const [newName, setNewName] = useState(user.displayName)
  const [pending, setPending] = useState(false)
  const [err, setErr] = useState('');
  const fileInput = useRef()

  const onChange = (e) => {
    const { target: { value } } = e
    setNewName(value)
  }

  // update
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newName) return
    if (user.displayName === newName && !imgFile) return
    
    const bannedNames = ['도망자💀', '도망자', '운영자']
    if (bannedNames.includes(newName)) {
      setErr('금지된 이름입니다.')
      return
    }

    setPending(true)
    let url = ""
    try {
      console.log(`imgFile`, imgFile)
      if (imgFile) { 
        const fileRef = ref(storage, `/users/${user.uid}/profile.jpg`); // uuidv4() 
        const snapshot = await uploadString(fileRef, imgFile.dataURL, 'data_url')
        console.log('Uploaded a data_url string!', snapshot);
        url = await getDownloadURL(fileRef)
      }
    } catch (err) {
      // 업로드 중 오류
      setPending(false)
      throw Error(err)
    }
    
    let obj = {
      displayName: newName,
    }
    if (url) {
      obj.photoURL = url
    }
    await userUpdate(obj)
    onClearFile()
    setPending(false)
  }

  const onFileChange = (e) => {
    const { target: { files } } = e
    const theFile = files[0]
    const reader = new FileReader()
    console.log(theFile)
    reader.readAsDataURL(theFile)
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent", finishedEvent)
      const {currentTarget: {result}} = finishedEvent
      setImgFile({dataURL:result, name:theFile.name})
    }
  }
  const onClearFile = () => {
    setImgFile(null)
    try {
      fileInput.current.value = null
    } catch (err) {
      // 그냥 알아서 초기화 시켜 ui 없애서
    }
    
  }

  useEffect(() => {
    console.log("profile form", user)
  }, [user])

  return (
    <div>
      <input id="fileInput" type="file" accept="image/*"
        onChange={onFileChange} ref={fileInput} className={stylesPaper.DisplayNone}
      />
      <div>
        {pending ?
          <div>...</div> : 
          <>
            <h2><span className="accent3">{ user.displayName }</span>'s Profile</h2>
            <div className={stylesPaper.FlexCenter}>
              <label htmlFor="fileInput">
                <Avatar className={ styles.ButtonFile }
                  alt={user.displayName}
                  src={user.photoURL}
                  sx={{ width: 64, height: 64, m:2 }}
                />
              </label>
              {imgFile && (
                <>
                  <span className={styles.ButtonFinger} onClick={ onClearFile }> 👉 </span>
                  <Avatar
                    alt={user.displayName}
                    src={imgFile.dataURL}
                    sx={{ width: 64, height: 64, m:2 }}
                  />
                </>
              )}
            </div>
            <form onSubmit={ onSubmit }>
              <TextField id="filled-basic" label="Display name" variant="filled"
              value={newName} onChange={ onChange }
              />
              <div>
                <Collapse in={err?true:false}>
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
                    sx={{ mt: 2 }}
                  >{ err }</Alert>
                </Collapse>
              </div>
              <div>
                <Button type="submit" variant="contained" sx={{ mt:2 }}>UPDATE</Button>
              </div>
            </form>
          </>
        }
      </div>
    </div>
  )
}

export default ProfileForm