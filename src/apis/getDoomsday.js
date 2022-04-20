import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'

export const getDoomsday = (lastCleanDate, placeDays) => {
  let theday = endOfDay(lastCleanDate)
  let doomsday = addDays(theday, placeDays)
  let howmany = differenceInDays(doomsday, endOfDay(new Date())) // 심판의 날이 얼마나 남았는지

  return {doomsday, howmany}
}