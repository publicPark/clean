import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { db } from '../../firebase'
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DiesIrae from "../Detail/DiesIrae";

const PlaceSimple = ({ place }) => {
  let navigate = useNavigate();

  const handleClick = () => {
    navigate(`/place/${place.id}`)
  }

  return (
    <Card sx={{ minWidth: 250, textAlign: 'left' }} elevation={place.lastClean && place.lastClean.myDies ? 3 : 1}>
      <CardActionArea onClick={ handleClick }>
        <CardContent>
          <Typography gutterBottom>
            <Link to={`/place/${place.id}`}><b>{place.name}</b></Link>
          </Typography>

          {place.lastClean?
            <DiesIrae data={place.lastClean} place={place}/>
            :
            <>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                청소한 적이 없음
              </Typography>
            </>
          }
          
        </CardContent>
      </CardActionArea>
      {/* {place.myDies &&
        <CardActions>
            <Link to={`/cleaned/${place.id}`}>
              <Button size="small">청소했어!</Button>
            </Link>
        </CardActions>
      } */}
    </Card>
  )
}

export default PlaceSimple