import { useEffect, useMemo, useState } from "react"
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import differenceInDays from 'date-fns/differenceInDays'
import endOfDay from 'date-fns/endOfDay'

const firstDate = Date.now()
const fmStr = "yyyy-MM-dd HH:mm";
const useNow = () => {
  const [now, setNow] = useState(firstDate)
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
  }, [thatTime, now])

  useEffect(() => {
    setInterval(updateNow, 1000)
    return clearInterval(updateNow)
  }, [])
  
  return { now, nowDistance, setThatTime, howmanyDoomsday }
}

export default useNow