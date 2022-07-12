
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import { useEffect } from 'react';
const Test = () => {
  const { currentUser: user, userDetail } = useAuth()
  let navigate = useNavigate();
  const test = () => {

  }

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return
    }
    if (userDetail && !userDetail.tester) {
      navigate('/', { replace: true });
      return
    }
  }, [user, userDetail])
  return <>
    {userDetail && userDetail.tester &&
      <Stack spacing={2} sx={{
        p: 2,
        textAlign: 'center',
        maxWidth: 500,
        margin: 'auto'
      }}>
        <h1>hello secret</h1>

        <Button size="small" onClick={test}>Test</Button>

        <Card sx={{ minWidth: 250, textAlign: 'left' }} elevation={ 2 } >
          <CardContent>
            <Typography gutterBottom>
              1234
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={test}>Test</Button>
          </CardActions>
        </Card>
      </Stack>
    }
  </>
}
export default Test