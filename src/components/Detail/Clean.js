import styles from './Clean.module.scss'
import format from 'date-fns/format'
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import useClean from '../../apis/useClean';
import { useAuth } from '../../contexts/AuthContext';

const Clean = ({ clean, place, getCleans, index }) => {
  const { currentUser } = useAuth()
  const [data, setData] = useState()
  const { loading: loadingClean, deleteClean, regret, forgive } = useClean()

  useEffect(() => {
    if (clean) {
      let newData = { ...clean }
      let theday = new Date(clean.date.seconds * 1000)
      newData.theday = format(theday, "yyyy-MM-dd") // 청소했던 날
      newData.createdFormatted = format(new Date(clean.created.seconds * 1000), "yyyy-MM-dd")
      if (place && place.membersMap && place.membersMap[clean.who]) {
        newData.whoText = place.membersMap[clean.who].name
      } else {
        newData.whoText = '???'
      }

      if (place && place.membersMap && place.membersMap[clean.target]) {
        newData.targetText = place.membersMap[clean.target].name
      } else {
        newData.targetText = '???'
      }

      if (currentUser && place) {
        newData.amIWriter = place.membersMap[clean.who] && place.membersMap[clean.who].id === currentUser.uid
        if (clean.target) {
          newData.amITarget = place.membersMap[clean.target] && place.membersMap[clean.target].id === currentUser.uid
        } else {
          newData.amITarget = place.membersMap[clean.who] && place.membersMap[clean.who].id === currentUser.uid
        }
      }
      
      setData(newData)
    }
  }, [clean, place])

  const printData = () => {
    console.log(data)
  }

  const handleClick = async (e) => {
    console.log(data)
    if (window.confirm("Do you really want to delete?")) {
      await deleteClean(data.id)
      getCleans()
    }
  }

  const handleRegret = async (val) => {
    let msg = val? "벌칙을 수행하고 반성했습니까?": '반성 취소?'
    if (window.confirm(msg)) {
      await regret(data.id, val)
      getCleans()
    }
  }

  return (
    <>
      { data &&
        <div onDoubleClick={printData}>
          <div className={styles.Flex}>
            <div className={styles.Memo}>{data.text}</div>
            <div>
              {index === 0 && data.amIWriter &&
                <IconButton aria-label="delete" size="small" sx={{ m: 1 }}
                  onClick={handleClick}
                  disable={ loadingClean?'true':'false' }
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              }
            </div>
          </div>
          <div className={styles.MarginTop}>
            <div className={styles.Blur}>
              cleaned <b>{data.theday }</b>
            </div>
            <div className={styles.Blur}>
              wrote <span className={ data.theday !== data.createdFormatted? styles.ColorAccent2:undefined }>{ data.createdFormatted }</span>
            </div>
            <div className={styles.Blur}>
              by <b>{data.whoText}</b>
            </div>
          </div>
          
          {/* 심판 받아야하는 경우 */}
          {data.judgement > 0 &&
            <div>
              <div className={styles.Penalty}>
                <b className={ data.regret?styles.LineThrough:undefined}>
                  <span>💰 </span>
                  <span className={data.judgement > 0 && data.amITarget ? styles.ColorAccent : undefined}>
                    { data.target? data.targetText : data.whoText }
                    { data.amITarget && '(나)'}
                  </span>
                  <span>에게 내려진 심판:</span> {data.judgement}일
                </b>
              </div>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                {data.amITarget && !data.regret &&
                  <Button variant="contained" onClick={ ()=>handleRegret(true) } disable={ loadingClean?'true':'false' }>벌칙을 수행하고 반성합니다</Button>
                }
                {data.amITarget && data.regret && 
                  <Button variant="outlined" color="neutral" onClick={ ()=>handleRegret(false) } disable={ loadingClean?'true':'false' }>벌칙을 수행하고 반성했습니다</Button>
                }
                {!data.amITarget && data.regret &&
                  <Button variant="contained" disabled>이 자는 벌칙을 수행하고 반성했습니다</Button>
                }
              </Stack>
            </div>
          }
        </div>
      }
    </>
  )
}

export default Clean