import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SnackbarContent from '@mui/material/SnackbarContent';
import Chip from '@mui/material/Chip';

const action = (
  <a href='https://kinclean.netlify.app/'>
    {/* <Button color="primary" size="small">
      여기!!
    </Button> */}
    <Chip label="HERE" color="primary" clickable />
  </a>
);

const OMG = () => {
  return (
    <>
      <Stack spacing={2} sx={{
        p: 2,
        textAlign: 'center',
        maxWidth: 500,
        margin: 'auto'
      }}>
        <SnackbarContent message="다른 곳으로 주소를 바꿨다!" action={action} />
      </Stack>
    </>
  )
}

export default OMG;