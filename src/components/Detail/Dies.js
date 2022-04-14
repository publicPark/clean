
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Clean.module.scss'

import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'

const Dies = ({ clean, place }) => {
  const { currentUser } = useAuth()
  const [data, setData] = useState()

  useEffect(() => {
    if (clean) {
      let newData = {...clean}
      let theday = new Date(clean.date.seconds * 1000)

      let doomsday = addDays(theday, place.days)
      newData.doomsday = doomsday // 심판의 날 날짜
      newData.howmany = differenceInDays(endOfDay(new Date()), doomsday) // 심판의 날이 얼마나 남았는지

      newData.doomsdayFormat1 = format(doomsday, "yyyy-MM-dd")
      newData.doomsdayFormat2 = format(doomsday, "HH:mm:ss")

      setData(newData)
      // console.log("test: ", theday, doomsday, place.days)
    }
  }, [clean])
  return data && ( 
    <div>
      <div>
        <b className={styles.ColorAccent}>☄️ Dies irae:</b> <span> <b>{ data.doomsdayFormat1 }</b> { data.doomsdayFormat2 }</span>
      </div>
      <div>
        <b className={currentUser && place.membersMap[data.next].id === currentUser.uid ? styles.ColorAccent3 : undefined}>
          {place.membersMap[data.next]? place.membersMap[data.next].name : '???'}
        </b>
        <b>{ currentUser && place.membersMap[data.next].id === currentUser.uid && '(나)'}</b>
        <span className={styles.Blur}>'s 차례</span>
        {data.howmany <= 0 ?
          data.howmany <= -3 ?
          <Chip sx={{ m:1 }} label={ `😎 ${data.howmany*-1}일 남음` } color="success" />
          :
          <Chip sx={{ m:1 }} label={ data.howmany===0? `🚨 오늘 당장!` : `😨 ${data.howmany*-1}일 남음` } color="error" />
          
        :
          <Chip sx={{ m:1 }} label={ `💩 ${data.howmany}일 지남` } color="neutral" />
        }
      </div>
    </div>
  )
}

export default Dies