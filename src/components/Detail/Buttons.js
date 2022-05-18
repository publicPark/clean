
import { useState } from 'react';
import ConfirmDialog from '../Utils/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext'
import usePlace from '../../apis/usePlace';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const Buttons = ({place, id}) => {
  const { currentUser } = useAuth()
  const [openGetout, setOpenGetout] = useState(false)
  const { loading: loadingPlace, getout } = usePlace(id)
  
  const handleGetOut = async () => {
    try {
      await getout(id, currentUser.uid)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      {currentUser &&
        (
          !place.members.includes(currentUser.uid) &&
          <Link to={ `/placejoin?code=${id}` }>
            <Button sx={{ m: 1 }} variant="contained" color="primary">참가하기! JOIN!</Button>
          </Link>
        ) 
      }
      
      {currentUser && place.members.includes(currentUser.uid) && !loadingPlace && <div>
        <>
          <Link to={`/invite/${id}`}>
            <Button variant="outlined" color="info">초대하기</Button>
          </Link>
          <Link to={`/placeform/${id}`}>
            <Button sx={{ ml: 1 }} variant="outlined" color="neutral">수정하기</Button>
          </Link>
        </>
        {place.members[0] === currentUser.uid && place.members.length === 1 ?
          <Link to={`/placeform/${id}`}>
            <Button sx={{ ml: 1 }} variant="outlined" color="neutral">영원히 나가고 삭제</Button>
          </Link>
          :
          <Button sx={{ ml: 1 }} variant="outlined" color="neutral" onClick={()=>setOpenGetout(true)}>나가기</Button>
        }
        <ConfirmDialog 
          msg1="Do you really want to get out?" 
          msg2="다시 들어올 수 있어요."
          open={openGetout}
          setOpen={setOpenGetout}
          callback={handleGetOut}
        />
      </div>
      }
    </>
  )
}

export default Buttons;