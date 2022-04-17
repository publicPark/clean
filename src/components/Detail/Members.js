import styles from './Place.module.scss'

import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Members = ({ members, membersMap, currentUser }) => {
  return (
    <>
      <div className={`${styles.Flex} ${styles.ListMember}`}>
        {members.map(((m, i) =>
          <ListItem key={i}>
            <Chip
              label={membersMap[m].name}
              color={currentUser&&currentUser.uid===membersMap[m].id?"success":"default"} 
              variant={currentUser&&currentUser.uid===membersMap[m].id?"contained":"outlined"}  />
          </ListItem>
        ))}
      </div>
    </>
  )
}

export default Members