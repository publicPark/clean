/**
summary: 초대 받은 사람 명단 
detail:
editor: 22-05-18 박지윤
*/
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
import { db } from '../../firebase'
import { getDocs, query, where, collection } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

const Invitees = ({ people=[] }) => {
  const [userMap, setUserMap] = useState()
  
  const getUsers = async (members) => {
    const q = query(collection(db, "users"), where('id', 'in', members))
    const querySnapshot = await getDocs(q);
    let obj = {}
    querySnapshot.forEach((doc) => {
      obj[doc.id] = doc.data()
    });
    setUserMap(obj)
  }

  useEffect(() => {
    if (people.length > 0) {
      getUsers(people)
    }
  }, [people])

  const print = () => {
    console.log(userMap)
  }

  return people.length>0 && (  
    <>
      <Typography sx={{ fontSize: 13, pt: 3 }} onDoubleClick={print}>
        📓 초대 명단
      </Typography>
      {/* {userMap && people.map((u) => {
        return <Typography
          color="text.secondary" 
          sx={{ fontSize: 13 }}
        >
          {userMap[u].name}
        </Typography>
      })} */}
      <AvatarGroup>
        {userMap && people.map((u, i) => {
          return <Avatar key={ i } alt={ userMap[u].name }
            src={userMap[u].photoURL}
            sx={{ width: 24, height: 24 }}
          />
        })}
      </AvatarGroup>
    </>
  )
}

export default Invitees;