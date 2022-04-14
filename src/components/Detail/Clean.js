import styles from './Clean.module.scss'

import format from 'date-fns/format'

import { useEffect, useState } from 'react';
import Dies from './Dies'

const Clean = ({ clean, place, isRecord }) => {
  const [data, setData] = useState()

  useEffect(() => {
    if (clean) {
      let newData = {...clean}
      let theday = new Date(clean.date.seconds * 1000)
      newData.theday = format(theday, "yyyy-MM-dd") // 청소했던 날
      newData.createdFormatted = format(new Date(newData.created.seconds * 1000), "yyyy-MM-dd")
      if (place && place.membersMap && place.membersMap[clean.who]) {
        newData.whoText = place.membersMap[clean.who].name
      } else {
        newData.whoText = '???'
      }
      
      setData(newData)
    }
  }, [clean])

  const printData = () => {
    console.log(data)
  }

  return (
    <>
      { data &&
        <div onDoubleClick={printData}>
          {!isRecord && <Dies clean={clean} place={place} />}
          
          <div className={styles.Memo}>{data.text}</div>

          <div className={styles.MarginTop}>
            <div className={styles.Blur}>
              cleaned <b>{data.theday }</b>
            </div>
            <div className={styles.Blur}>
              wrote { data.createdFormatted }
            </div>
            <div className={styles.Blur}>
              by <b>{ data.whoText }</b>
            </div>
          </div>

          {data.penalty > 0 &&
            <div className={styles.MarginTop}>
              벌칙: { data.penalty }
            </div>
          }
        </div>
      }
    </>
  )
}

export default Clean