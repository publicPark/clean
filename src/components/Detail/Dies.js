
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Clean.module.scss'

import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import useNow from "../../apis/useNow";
import { db } from '../../firebase'
import { doc, getDoc } from "firebase/firestore"; 

const Dies = ({ clean, place }) => {
  let { nowDistance, setThatTime } = useNow()
  const { currentUser } = useAuth()
  const [data, setData] = useState()

  const initialize = async () => {
    let newData = { ...clean }
    let theday = endOfDay(new Date(clean.date.seconds * 1000))

    let doomsday = addDays(theday, place.days)
    setThatTime(doomsday)
    let howmany = differenceInDays(doomsday, endOfDay(new Date())) // 심판의 날이 얼마나 남았는지
    newData.doomsday = doomsday // 심판의 날 날짜
    newData.howmany = howmany
    
    try {
      newData.doomsdayFormat1 = format(doomsday, "yyyy-MM-dd")
      newData.doomsdayFormat2 = format(doomsday, "HH:mm:ss")
    } catch (err) {
      console.log(err)
    }

    const docRef = doc(db, "users", clean.next);
    const userDocSnap = await getDoc(docRef);
    newData.nextData = userDocSnap.data()

    setData(newData)
  }
  useEffect(() => {
    if (clean && place) {
      initialize()
    }
  }, [])

  // 초가 지날때
  useEffect(() => {
    if (data) {
      // console.log("nowDistance", nowDistance)
      let newData = { ...data }
      let howmany = differenceInDays(data.doomsday, endOfDay(new Date())) // 심판의 날이 얼마나 남았는지
      newData.howmany = howmany
      setData(newData)
    }
  }, [nowDistance])

  const print = () => {
    console.log("place", place)
    console.log("data", data)
    console.log("clean", clean)
  }

  return (
    <> 
      {data && place &&
        <div onDoubleClick={print}>
          <div className={styles.Flex}>
            <div className={ styles.Who}>
              <b className={currentUser && data.next === currentUser.uid ? styles.ColorAccent3 : undefined}>
                { data.nextData ? data.nextData.name : '???' }
              </b>
              <b>{ currentUser && data.next === currentUser.uid && '(나)'}</b>
              <span className={styles.Blur}>'s 차례 </span>
            </div>
            {data.howmany === 0 &&
              <>
                <Chip sx={{ mr: 1, mb: 1, mt: 1 }} label={`🚨 오늘 당장!`} color="error" />
              </>
            }
            {data.howmany > 0 &&
            <Chip sx={{ mr: 1, mb: 1, mt: 1 }}
              label={data.howmany > 3 ? `😎 ${data.howmany}일 남음` : `😨 ${data.howmany}일 남음`}
              color={data.howmany > 3 ? "success" : "warning"}
              />
            }
            {data.howmany < 0 &&
              <Chip sx={{ mr:1, mb:1, mt:1 }} label={ `💩 ${data.howmany * -1}일 지남` } color="error" />
            }
          </div>
          <div>
            <b className={styles.ColorAccent}>☄️ Dies irae:</b>
            <span> <b>{data.doomsdayFormat1}</b> <span className={styles.Blur}>{data.doomsdayFormat2}</span></span>
          </div>
          {data.howmany ===0 && 
            <div className={styles.TimeLeft}>
              <b>{`${nowDistance}`}</b>
            </div>
          }
        </div>
      }
    </>
  )
    
}

export default Dies