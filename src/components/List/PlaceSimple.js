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
import format from 'date-fns/format'

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const PlaceSimple = ({ place, hideDies }) => {
  let navigate = useNavigate();
  const [calendarUrl, setCalendarUrl] = useState("")

  const handleClick = () => {
    navigate(`/place/${place.id}`)
  }

  useEffect(() => {
    if (place.lastClean) {
      const nextDueDate = new Date(place.lastClean.date.seconds*1000).addDays(parseInt(place.days));
      const strNextDueDate = format(nextDueDate, 'yyyyMMdd');
      setCalendarUrl(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(place.name+' Dies irae 🚨')}&dates=${strNextDueDate}/${strNextDueDate}`);
    }
  }, [])

  return (
    <Card sx={{ minWidth: 250, textAlign: 'left' }} elevation={place.lastClean && place.lastClean.myDies ? 3 : 1}>
      <CardActionArea onClick={ handleClick }>
        <CardContent>
          <Typography gutterBottom>
            <Link to={`/place/${place.id}`}><b>{place.name}</b></Link>
          </Typography>

          {!hideDies ? (
              place.lastClean ?
              <DiesIrae data={place.lastClean} place={place}/>
              :
              <>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                  청소한 적이 없음
                </Typography>
              </>
            )
            :
            <>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                {place.members.map((m, i) => {
                  return i%2===0? '💃' : '🕺'
                })}
              </Typography>
            </>
          }
          
        </CardContent>
      </CardActionArea>
      {/* {place.lastClean && place.lastClean.myDies &&
        <CardActions>
            <Link to={`/cleaned/${place.id}`}>
              <Button size="small">청소했어요!</Button>
            </Link>
        </CardActions>
      } */}
      {place.lastClean && place.lastClean.myDies &&
        <CardActions>
          <a href={ calendarUrl } target="_blank" rel="noreferrer">
            <Button size="small">내 캘린더에 Dies irae 추가</Button>
          </a>
        </CardActions>
      }
    </Card>
  )
}

export default PlaceSimple