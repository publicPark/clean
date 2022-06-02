import styles from './Place.module.scss'
import { useAuth } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import ConfirmDialog from '../Utils/ConfirmDialog';
import { useState } from 'react';
import usePlace from '../../apis/usePlace';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Members = ({ members, userMap, id }) => {
  const { currentUser } = useAuth()
  const [openOut, setOpenOut] = useState(false)
  const [mid, setMid] = useState()
  const { loading, getout } = usePlace(id)
  const [msg, setMsg] = useState(false)

  const handleClick = (mid) => {
    setMid(mid) // 멤버 아이디
    setOpenOut(true)
  }

  const handleOut = async () => {
    // 추방
    if(!currentUser || !members.includes(currentUser.uid)){
      setMsg("이방인은 권한이 없습니다.")
      return
    }
    if(members[0] == currentUser.uid){
      try {
        await getout(id, mid)
      } catch (err) {
        setMsg(err)
      }
    }else{
      setMsg("왕관을 쓴 자가 할 수 있습니다.")
    }
  }  

  return (
    <>
      <div className={`${styles.Flex} ${styles.ListMember}`}>
        {userMap && members.map(((m, i) =>
          <ListItem key={i} className={ styles.Member }>
            {i === 0 && <span className={ styles.Crown }>👑</span>}
            <Chip
              onClick={currentUser?()=>handleClick(m):undefined}
              avatar={<Avatar alt="프사" src={userMap[m]?userMap[m].photoURL:''} />}
              label={userMap[m]? userMap[m].name : '?'}
              color={currentUser&&userMap[m]&&currentUser.uid===userMap[m].id?"success":"default"} 
              variant="contained"  />
          </ListItem>
        ))}
        <ConfirmDialog 
          msg1={userMap[mid]?userMap[mid].name:''}
          msg2="이 자를 해방시키시겠습니까?"
          open={openOut}
          setOpen={setOpenOut}
          callback={handleOut}
        />
        <ConfirmDialog 
          msg2={msg}
          open={msg}
          setOpen={setMsg}
        />
      </div>
    </>
  )
}

export default Members