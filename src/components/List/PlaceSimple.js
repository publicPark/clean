import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import format from 'date-fns/format'
import { db } from '../../firebase'
import { doc, getDoc } from "firebase/firestore";
import useNow from "../../apis/useNow";
import { useNavigate } from "react-router-dom";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Stack } from "@mui/material";

const PlaceSimple = ({ place }) => {
  let navigate = useNavigate();
  let { nowDistance, setThatTime } = useNow()
  const [data, setData] = useState() // clean

  const formatData = async () => {
    setThatTime(place.doomsday)
    let newData = {...place.lastClean}
    const docRef = doc(db, "users", newData.next);
    const userDocSnap = await getDoc(docRef);
    newData.nextData = userDocSnap.data()
    setData(newData)
  }

  useEffect(() => {
    // console.log("place simple", place)
    formatData()
  }, [])

  const handleClick = () => {
    navigate(`/place/${place.id}`)
  }

  return (
    <Card sx={{ minWidth: 250, textAlign: 'left' }} elevation={place.myDies ? 3 : 1}>
      <CardActionArea onClick={ handleClick }>
        <CardContent>
          <Typography gutterBottom>
            <Link to={`/place/${place.id}`}><b>{place.name}</b></Link>
          </Typography>

          {data && 
            <>
              <Typography sx={{ fontSize: 15, mb: 1.5 }}>
                <span className="accent">
                  ☄️ Dies irae: 
                </span> <b>{format(place.doomsday, "yyyy-MM-dd")}</b> <span className="blur">{format(place.doomsday, "HH:mm:ss")}</span>
              
                {/* {place.howmany === 0 &&
                  <span className="accent"> { nowDistance }</span>
                } */}
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                variant="body2" sx={{ fontSize:15, flexWrap:'wrap' }}
              >
                <div>
                  {place.myDies && <b className="accent3">내 차례 </b>}
                  {!place.myDies && 
                    <>
                      {data && data.nextData ?
                        <b>{data.nextData.name || ''}</b>
                        :<b>...</b>  
                      }
                      <span className="blur">'s 차례 </span>
                    </>
                  }
                </div>

                <div>
                  {place.howmany === 0 &&
                    <div className="accent">
                      <span>{nowDistance} </span>
                      <b>🚨 오늘 당장! </b>
                    </div>
                  }
                  {place.howmany > 0 &&
                    (place.howmany > 3 ?
                    <>
                      <span>😎 </span>
                      <b>{place.howmany}</b>
                      <span className="blur">일 남음</span>
                    </>
                    :
                    <>
                      <span>😨 </span>
                      <b>{place.howmany}</b>
                      <span className="blur">일 남음</span>
                    </>
                    )
                  }
                  {place.howmany < 0 &&
                    <div className="accent">
                      <span>⌛ </span>
                      <b>{place.howmany*-1}</b>
                      <span>일 지남</span>
                    </div>
                  }
                </div>
              </Stack>  
            </>
          }
          
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        {place.myDies &&
          <Link to={`/cleaned/${place.id}`}>
            <Button size="small">청소했어!</Button>
          </Link>
        }
      </CardActions> */}
    </Card>
  )
}

export default PlaceSimple