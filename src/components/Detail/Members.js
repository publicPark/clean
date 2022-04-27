import styles from './Place.module.scss'

import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useAuth } from '../../contexts/AuthContext';


const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Members = ({ members, userMap }) => {
  const { currentUser } = useAuth()
  
  return (
    <>
      <div className={`${styles.Flex} ${styles.ListMember}`}>
        {userMap && members.map(((m, i) =>
          <ListItem key={i} className={ styles.Member }>
            {i === 0 && <span className={ styles.Crown }>👑</span>}
            <Chip
              label={userMap[m]? userMap[m].name : '(new)'}
              color={currentUser&&userMap[m]&&currentUser.uid===userMap[m].id?"success":"default"} 
              variant="contained"  />
          </ListItem>
        ))}
      </div>
    </>
  )
}

export default Members