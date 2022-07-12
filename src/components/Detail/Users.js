
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';

import usePlace from '../../apis/usePlace';

const Users = ({ place, users }) => {
  const { loading: loadingPlace, invite, inviteCancel } = usePlace(place.id)
  const [list, setList] = useState(users)

  useEffect(() => {
    let newArr = [...users]
    for (let x in newArr) {
      // console.log("x", x, newArr[x])
      if (place.membersInvited && place.membersInvited.includes(newArr[x].id)) {
        newArr[x].send = true
      } else {
        newArr[x].send = false
      }
    }
    
    setList(newArr)
    return () => {
    }
  }, [users])
  
  const handleClick = async (u, i) => {
    try {
      await invite(place.id, u.id)
    } catch (err) {
      return
    }

    // 보냈다
    let newList = [...users]
    newList[i].send = true
    setList(newList)
  }
  const handleClickCancel = async (u, i) => {
    try {
      await inviteCancel(place.id, u.id)
    } catch (err) {
      return
    }
    let newList = [...users]
    newList[i].send = false
    setList(newList)
  }

  return (list &&
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {list.map(((u,i) => <div key={ i }>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={u.photoURL} />
            </ListItemAvatar>
            <ListItemText
              primary={u.name}
              secondary={
                <>
                  { u.tester?'터줏대감':'주민'}
                </>
              }
            />
            {place.members.includes(u.id) ?
              <Chip label="이미 멤버"
                sx={{ mt: 1, ml: 2 }}
                disabled
                onClick={() => handleClick(u, i)}
              />
              :
              !u.send ?
              <Chip label="초대장 보내기"
                sx={{ mt: 1, ml: 2 }}
                color="primary"
                disabled={ loadingPlace }
                onClick={() => handleClick(u, i)}
              />
              :
              <Chip label="보내기 취소"
                sx={{ mt: 1, ml: 2 }}
                disabled={ loadingPlace }
                onClick={() => handleClickCancel(u, i)}
              />
            }
          </ListItem>
          {i < list.length-1 && <Divider variant="inset" component="li" /> }
        </div>))}
      </List>
    </>
  )
}

export default Users