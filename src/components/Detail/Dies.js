
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Clean.module.scss'

import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import useNow from "../../apis/useNow";

const Dies = ({ clean, place }) => {
  let { nowDistance, setThatTime } = useNow()
  const { currentUser } = useAuth()
  const [data, setData] = useState()

  useEffect(() => {
    if (clean && place) {
      let newData = { ...clean }
      let theday = endOfDay(new Date(clean.date.seconds * 1000))

      let doomsday = addDays(theday, place.days)
      setThatTime(doomsday)
      newData.doomsday = doomsday // 심판의 날 날짜
      let howmany = differenceInDays(doomsday, endOfDay(new Date())) // 심판의 날이 얼마나 남았는지
      newData.howmany = howmany
      if (howmany === 0) {
        newData.howmanyFormat = nowDistance
      }
      
      try {
        newData.doomsdayFormat1 = format(doomsday, "yyyy-MM-dd")
        newData.doomsdayFormat2 = format(doomsday, "HH:mm:ss")
      } catch (err) {
        console.log(err)
      }
      setData(newData)
    }
  }, [clean, place])

  useEffect(() => {
    if (data) {
      console.log("nowDistance", nowDistance)
      let newData = { ...data }
      let howmany = differenceInDays(data.doomsday, endOfDay(new Date())) // 심판의 날이 얼마나 남았는지
      newData.howmany = howmany
      if (howmany === 0) {
        newData.howmanyFormat = nowDistance
      }
      setData(newData)
    }
  }, [nowDistance])

  return (
    <> 
      {data && place.membersMap[data.next] &&
        <div>
          <div className={styles.Flex}>
            <div className={ styles.Who}>
              <b className={currentUser && place.membersMap[data.next].id === currentUser.uid ? styles.ColorAccent3 : undefined}>
                {place.membersMap[data.next]? place.membersMap[data.next].name : '???'}
              </b>
              <b>{ currentUser && place.membersMap[data.next].id === currentUser.uid && '(나)'}</b>
              <span className={styles.Blur}>'s 차례 </span>
            </div>
              {data.howmany === 0 &&
                <>
                  <Chip sx={{ mr: 1, mb: 1, mt: 1 }} label={`🚨 오늘 당장!`} color="error" />
                </>
              }
              {data.howmany > 0 && 
                <Chip sx={{ mr: 1, mb: 1, mt: 1 }}
                  label={ data.howmany > 3?`😎 ${data.howmany}일 남음`:`😨 ${data.howmany}일 남음`}
                  color="success"
                />
              }
              {data.howmany < 0 &&
                <Chip sx={{ mr:1, mb:1, mt:1 }} label={ `💩 ${data.howmany * -1}일 지남` } color="neutral" />
              }
          </div>
          <div>
            <b className={styles.ColorAccent}>☄️ Dies irae:</b>
            <span> <b>{data.doomsdayFormat1}</b> <span className={styles.Blur}>{data.doomsdayFormat2}</span></span>
          </div>
          {data.howmanyFormat &&
            <div className={styles.ColorAccent}>
              <b>{`in ${data.howmanyFormat}!!`}</b>
            </div>
          }
        </div>
      }
    </>
  )
    
}

export default Dies