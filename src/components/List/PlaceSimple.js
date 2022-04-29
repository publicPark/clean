import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/AuthContext';

import usePlace from '../../apis/usePlace';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

const PlaceSimple = ({ place }) => {
  const { loading: loadingPlace } = usePlace(place.id)
  const handleYeah = () => {

  }

  useEffect(() => {
    // 라스트 이벤트 가져올거임
    
  }, [])

  return (
    <Card sx={{ minWidth: 250, textAlign:'left' }}>
      <CardContent>
        <Typography gutterBottom>
          <Link to={`/place/${place.id}`}>{place.name}</Link>
        </Typography>
        <Typography sx={{ fontSize: 14, mb: 1.5 }} color="text.secondary" >
          ⌛ 최대 청소 주기: {place.days}일
        </Typography>
        {place.test && 
          <Typography variant="body2">
            공개 구역입니다
          </Typography>
        }
      </CardContent>
      <CardActions>
        {loadingPlace ? '...'
          :
          <> 
            <Button size="small" onClick={ handleYeah }>청소했어요!</Button>
          </>
        }
      </CardActions>
    </Card>
  )
}

export default PlaceSimple