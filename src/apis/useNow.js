import { useEffect, useMemo, useState } from "react"
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import differenceInDays from 'date-fns/differenceInDays'
import endOfDay from 'date-fns/endOfDay'

const firstDate = Date.now()
const fmStr = "yyyy-MM-dd HH:mm";
const useNow = () => {
  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd")
  }
  
  const [now, setNow] = useState(firstDate)
  const [today, setToday] = useState(formatDate(firstDate))
  const [thatTime, setThatTime] = useState()
  const [nowDistance, setNowDistance] = useState('')
  const [howmanyDoomsday, setHowmanyDoomsday] = useState('')

  const updateNow = () => {
    let nowTime = Date.now()
    setNow(nowTime)
  }

  useEffect(() => {
    if (thatTime) {
      setNowDistance(formatDistanceToNow(thatTime, { addSuffix: true }))
      let howmany = differenceInDays(thatTime, endOfDay(now)) // 심판의 날이 얼마나 남았는지
      setHowmanyDoomsday(howmany)
    }
    let todayUpdated = formatDate(now)
    setToday(todayUpdated)
  }, [thatTime, now])

  useEffect(() => {
    setInterval(updateNow, 1000)
    return clearInterval(updateNow)
  }, [])
  
  return { now, nowDistance, setThatTime, howmanyDoomsday, today, formatDate }
}

export default useNow