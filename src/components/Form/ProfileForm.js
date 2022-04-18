import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import stylesPaper from '../styles/Paper.module.scss'

import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ProfileForm = () => {
  const { currentUser:user, userUpdate } = useAuth()
  const [newName, setNewName] = useState(user.displayName)
  const [pending, setPending] = useState(false)
  const onChange = (e) => {
    const { target: { value } } = e
    setNewName(value)
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.displayName === newName) return
    setPending(true)
    await userUpdate({displayName: newName})
    setPending(false)
  }

  return (
    <div className={stylesPaper.Flex}>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          지송.. 여긴 아직 공사중
        </div>
      </div>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>{ user.displayName }'s Profile</h2>
          <div>
            {pending ?
              <div>...</div> : 
              <>
                <div className={ stylesPaper.Flex }>
                  <Avatar
                    alt={user.photoURL}
                    src={user.photoURL}
                    sx={{ width: 64, height: 64, m:2 }}
                  />
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