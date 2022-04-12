import { useAuth } from '../../contexts/AuthContext'
import styles from './Clean.module.scss'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import startOfDay from 'date-fns/startOfDay'
import format from 'date-fns/format'

import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';

const Clean = ({ clean, place, isRecord }) => {
  const { currentUser } = useAuth()
  const [data, setData] = useState()

  useEffect(() => {
    if (clean) {
      let newData = {...clean}
      let theday = new Date(clean.date.seconds * 1000)
      newData.theday = format(theday, "yyyy-MM-dd") // 청소했던 날
      newData.createdFormatted = format(new Date(clean.created.seconds * 1000), "yyyy-MM-dd")
      let res = formatDistanceToNow(startOfDay(theday), { addSuffix: true })
      newData.distance = res // 오늘로부터 얼마전에 청소했는지

      let doomsday = addDays(theday, place.days)
      // console.log(data.text + "test: ", theday, doomsday, place.days)
      newData.doomsday = doomsday // 심판의 날 날짜
      newData.howmany = differenceInDays(endOfDay(new Date()), doomsday) // 심판의 날이 얼마나 남았는지
      setData(newData)
    }
  }, [clean])

  const printData = () => {
    console.log(data)
  }

  return (
<>
  {
    data &&
    <div onDoubleClick={printData}>
      <div className={styles.Blur}>
        was cleaned <b>{ isRecord? data.theday : data.distance }</b> by <b>{place.membersMap[data.who] ?
        place.membersMap[data.who].name : '???'}</b>
      </div>
                  
      <div className={styles.Memo}>{data.text}</div>

      {!isRecord && data.doomsday &&
        <div className={styles.MarginTop}>
          <div>
            <b className={styles.ColorAccent}>☄️ Dies irae:</b> <b>
            {format(data.doomsday, "yyyy-MM-dd")}</b> {format(data.doomsday, "HH:mm:ss")}
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
      }
    </div>
  }
</>
  )
}

export default Clean