import format from 'date-fns/format'
import Typography from '@mui/material/Typography';
import { Stack } from "@mui/material";
import useNow from "../../apis/useNow";
import { useEffect, useState } from 'react';
import { db } from '../../firebase'
import { doc, getDoc } from "firebase/firestore";

const DiesIrae = ({ place, data }) => {
  let { nowDistance, setThatTime } = useNow()
  const [str1, setStr1] = useState('')
  const [str2, setStr2] = useState('')

  const [clean, setClean] = useState({}) // clean

  const formatData = async () => {
    let newData = {...data}
    const docRef = doc(db, "users", newData.next);
    const userDocSnap = await getDoc(docRef);
    newData.nextData = userDocSnap.data()

    setThatTime(newData.doomsday)
    setStr1(format(newData.doomsday, "yyyy-MM-dd"))
    setStr2(format(newData.doomsday, "HH:mm:ss"))
    setClean(newData)
  }

  useEffect(() => {
    if (data) {
      // console.log("last", place.lastClean)
      formatData()
    }
  }, [data])

  return (
    <>
      <Typography sx={{ fontSize: 15, mb: 1.5 }}>
        <span className="accent">
          ☄️ Dies irae: 
        </span> <b>{str1}</b> <span className="blur">{str2}</span>
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        variant="body2" sx={{ fontSize:15, flexWrap:'wrap' }}
      >
        <div>
          {clean.myDies && <b className="accent3">내 차례 </b>}
          {!clean.myDies && 
            <>
              {clean && clean.nextData ?
                <span>{clean.nextData.name || ''}</span>
                :<span>...</span>  
              }
              <span className="blur">'s 차례 </span>
            </>
          }
        </div>

        <div>
          {clean.howmany === 0 &&
            <div className="accent">
              <span>{nowDistance} </span>
              <b>🚨 오늘 당장! </b>
            </div>
          }
          {clean.howmany > 0 &&
            (clean.howmany > 3 ?
            <>
              <span>😎 </span>
              <b>{clean.howmany}</b>
              <span className="blur">일 남음</span>
            </>
            :
            <>
              <span>😨 </span>
              <b>{clean.howmany}</b>
              <span className="blur">일 남음</span>
            </>
            )
          }
          {clean.howmany < 0 &&
            <div className="accent">
              <span>⌛ </span>
              <b>{clean.howmany*-1}</b>
              <span>일 지남</span>
            </div>
          }
        </div>
      </Stack>  
    </>
  )
}

export default DiesIrae