import usePlace from '../../apis/usePlace';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

const Invitation = ({ data }) => {
  const { loading: loadingPlace, inviOk, inviNo } = usePlace(data.id)

  const handleOk = () => {
    inviOk(data.id)
  }

  const handleNo = () => {
    inviNo(data.id)
  }

  return (
    <Card sx={{ minWidth: 250, textAlign: 'left' }} elevation={ 2 } >
      <CardContent>
        <Typography gutterBottom>
          <Link to={`/place/${data.id}`}><b>{data.name}</b></Link>
        </Typography>
        <Typography sx={{ fontSize: 14, mb: 1.5 }} color="text.secondary" >
          ⏳ 최대 청소 주기: {data.days}일
        </Typography>
        {data.test && 
          <Typography variant="body2">
            공개 구역입니다
            <br />
            수락 거절은 님의 자유입니다
          </Typography>
        }
      </CardContent>
      <CardActions>
        {loadingPlace ? '...'
          :
          <> 
            <Button size="small" onClick={ handleOk }>초대 수락하기</Button>
            <Button size="small" onClick={handleNo}>거절하기</Button>
          </>
        }
      </CardActions>
    </Card>
  )
}

export default Invitation