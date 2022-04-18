import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import stylesPaper from '../styles/Paper.module.scss'

import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { storage } from "../../firebase"
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const ProfileForm = () => {
  const { currentUser:user, userUpdate } = useAuth()
  const [imgFile, setImgFile] = useState()
  const [newName, setNewName] = useState(user.displayName)
  const [pending, setPending] = useState(false)
  const fileInput = useRef()

  const onChange = (e) => {
    const { target: { value } } = e
    setNewName(value)
  }

  // update
  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.displayName === newName && !imgFile) return

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
    fileInput.current.value = null
  }

  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          허허허허
          <input id="fileInput" type="file" accept="image/*"
            onChange={onFileChange} ref={fileInput} className={stylesPaper.DisplayNone}
          />
        </div>
      </div>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2><span className="accent3">{ user.displayName }</span>'s Profile</h2>
          <div>
            {pending ?
              <div>...</div> : 
              <>
                <div className={stylesPaper.FlexCenter}>
                  <label htmlFor="fileInput">
                    <Avatar className={ stylesPaper.ButtonFile }
                      alt={user.displayName}
                      src={user.photoURL}
                      sx={{ width: 64, height: 64, m:2 }}
                    />
                  </label>
                  {imgFile && (
                    <>
                      👉 
                      <Avatar onClick={ onClearFile }
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
                    <Button type="submit" variant="contained" sx={{ mt:2 }}>UPDATE</Button>
                  </div>
                </form>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileForm