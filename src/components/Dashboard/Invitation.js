import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/AuthContext';

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
    inviOk()
  }

  const handleNo = () => {
    inviNo()
  }

  return (
    <Card sx={{ minWidth: 250, textAlign:'left' }}>
      <CardContent>
        <Typography gutterBottom>
          <Link to={`/place/${data.id}`}>{data.name}</Link>
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" >
          ⌛ 최대 청소 주기: {data.days}일
        </Typography>
      </CardContent>
      <CardActions>
        {loadingPlace ? '...'
          :
          <> 
            <Button size="small" onClick={ handleOk }>초대 수략하기</Button>
            <Button size="small" onClick={handleNo}>거절하기</Button>
          </>
        }
      </CardActions>
    </Card>
  )
}

export default Invitation