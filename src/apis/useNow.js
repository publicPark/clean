import { useEffect, useMemo, useState } from "react"
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const firstDate = Date.now()
const fmStr = "yyyy-MM-dd HH:mm";
const useNow = () => {
  const [now, setNow] = useState(firstDate)
  const [thatTime, setThatTime] = useState()
  const [nowDistance, setNowDistance] = useState('')

  const updateNow = () => {
    let nowTime = Date.now()
    setNow(nowTime)
  }

  useEffect(() => {
    if (thatTime) {
      setNowDistance(formatDistanceToNow(thatTime, { addSuffix: true }))
    }
  }, [thatTime, now])

  useEffect(() => {
    setInterval(updateNow, 1000)
    return clearInterval(updateNow)
  }, [])
  
  return { now, nowDistance, setThatTime }
}

export default useNow