import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Members = ({ members, membersMap, currentUser }) => {
  return (
    <>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0.5,
          m: 0,
          mt: 1,
        }}
        component="ul"
      >
        {members.map(((m, i) =>
          <ListItem key={i}>
            <Chip
              label={membersMap[m].name}
              color={currentUser&&currentUser.uid===membersMap[m].id?"primary":"default"} 
              variant="outlined" />
          </ListItem>
        ))}
      </Paper>
    </>
  )
}

export default Members