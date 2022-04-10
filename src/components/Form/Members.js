import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const Members = ({ members, membersMap, currentUser }) => {
  return (
    <>
      <Stack direction="row" spacing={1} mt={1}
        justifyContent="center"
        alignItems="center">
        {members.map(((m, i) =>
          <Chip key={i}
            label={membersMap[m].name}
            color={currentUser&&currentUser.uid===membersMap[m].id?"primary":"default"} 
            variant="outlined" />
        ))}
      </Stack>
    </>
  )
}

export default Members