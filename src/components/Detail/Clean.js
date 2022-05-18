import styles from './Clean.module.scss'
import format from 'date-fns/format'
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ConfirmDialog from '../Utils/ConfirmDialog';

import useClean from '../../apis/useClean';
import { useAuth } from '../../contexts/AuthContext';

const Clean = ({ clean, place, getCleans, index, userMap }) => {
  const { currentUser } = useAuth()
  const [data, setData] = useState()
  const [memoForm, setMemoForm] = useState(false)
  const [memo, setMemo] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const [openRegret, setOpenRegret] = useState(false)
  const [openRegret2, setOpenRegret2] = useState(false)
  const { loading: loadingClean, deleteClean, regret, editText, clap, getClean } = useClean()

  const formatClean = (c) => {
    let newData = { ...c }
    let theday = new Date(clean.date.seconds * 1000)
    newData.theday = format(theday, "yyyy-MM-dd") // 청소했던 날
    newData.createdFormatted = format(new Date(clean.created.seconds * 1000), "yyyy-MM-dd")
    if (place && userMap && userMap[clean.who]) {
      newData.whoText = userMap[clean.who].name
    } else {
      // if(place && place.membersMap) newData.whoText = place.membersMap[clean.who].name
      newData.whoText = '도망자💀'
    }

    if (place && userMap && userMap[clean.target]) {
      newData.targetText = userMap[clean.target].name
    } else {
      // if(place && place.membersMap) newData.targetText = place.membersMap[clean.target].name
      newData.targetText = '도망자💀'
    }

    try {
      if (currentUser && place) {
        newData.amIWriter = userMap[clean.who] && userMap[clean.who].id === currentUser.uid
        if (clean.target) {
          newData.amITarget = clean.target === currentUser.uid
        } else {
          newData.amITarget = clean.who === currentUser.uid
        }
      }
    } catch (err) {
      console.log(err)
    }
    
    setMemo(newData.text)
    setData(newData)
  }
  useEffect(() => {
    if (clean) {
      formatClean(clean)
    }
  }, [clean])

  const printData = () => {
    console.log(data)
  }

  const handleDelete = async () => {
    await deleteClean(data.id)
    getCleans()
  }

  const handleRegret = async (val) => {
    await regret(data.id, val)
    const res = await getClean(data.id)
    formatClean(res)
  }

  const handleEdit = async () => {
    await editText(data.id, memo)
    setMemoForm(false)
    const res = await getClean(data.id)
    formatClean(res)
  }

  const handleClap = async (val) => {
    await clap(data.id, val, currentUser.uid)
    const res = await getClean(data.id)
    formatClean(res)
  }

  return (
    <>
      { data &&
        <div onDoubleClick={printData}>
          <div className={styles.FlexSpace}>
            {memoForm && !loadingClean ?
              <div className={styles.Flex}>
                {/* <TextField id="standard-memo" variant="standard"
                value={memo} onChange={(e)=>{setMemo(e.target.value)}}
                /> */}
                <TextareaAutosize
                  aria-label="좀 더 넓은 메모"
                  minRows={3}
                  placeholder="메모"
                  style={{ width: 200, resize: 'none' }}
                  value={memo} onChange={(e) => { setMemo(e.target.value) }}
                />
                {data.amIWriter && <>
                  <IconButton aria-label="delete" size="small"
                    onClick={ ()=>setMemoForm((cur)=>!cur) }
                  >
                    <CancelIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton aria-label="delete" size="small"
                    onClick={ handleEdit }
                  >
                    <SaveIcon fontSize="inherit" />
                  </IconButton>
                </>
                }
              </div>
              :
              <div
                className={`${styles.Memo} ${data.amIWriter ? styles.Pointer : undefined}`} 
                onClick={() => setMemoForm((cur) => data.amIWriter ? !cur : cur)}>
                
                <Typography variant="body2" sx={{whiteSpace:'pre-line'}}>
                  <span className='blur'>"</span>
                  <i>{data.text}</i>
                  <span className='blur'> "</span>
                </Typography>
              </div>
            }
            <div>
              <ConfirmDialog
                msg1="Do you really want to delete?"
                msg2="삭제하시겠습니까?"
                open={openDelete}
                setOpen={setOpenDelete}
                callback={handleDelete}
              />
              {index === 0 && data.amIWriter &&
                <IconButton aria-label="delete" size="small" sx={{ ml: 1 }}
                  onClick={()=>setOpenDelete(true)}
                  disabled={ loadingClean?true:false }
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              }
            </div>
          </div>
          <div className={`${styles.MarginTop} ${styles.Dates}`}>
            <div className={styles.Blur}>
              cleaned <b>{data.theday }</b>
            </div>
            <div className={styles.Blur}>
              wrote <span className={ data.theday !== data.createdFormatted? styles.ColorAccent2:undefined }>{ data.createdFormatted }</span>
            </div>
            <div className={`${styles.Blur} ${styles.FlexSpace}`}>
              <div>
                by <b className={currentUser && currentUser.uid === data.who ? 'accent3' : ''}>{data.whoText}</b>
                { data.target && data.target !== data.who &&
                  <> for <span className={currentUser && currentUser.uid === data.target ? 'accent3' : ''}>{data.targetText}</span>
                  </>
                }
              </div>
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
                  <span>에게 내려진 심판의 무게:</span> <span className="accent">{data.judgement}일</span>
                </b>
              </div>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <ConfirmDialog
                  msg2="벌칙을 수행하고 반성했습니까?"
                  open={openRegret}
                  setOpen={setOpenRegret}
                  callback={()=>handleRegret(true)}
                />
                <ConfirmDialog
                  msg2="반성 취소?"
                  open={openRegret2}
                  setOpen={setOpenRegret2}
                  callback={()=>handleRegret(false)}
                />
                {data.amITarget && !data.regret &&
                  <Button variant="contained" onClick={ ()=>setOpenRegret(true) } disabled={ loadingClean?true:false }>벌칙을 수행하고 반성합니다</Button>
                }
                {data.amITarget && data.regret && 
                  <div className={ styles.Blur } onClick={ ()=>setOpenRegret2(true) } disabled={ loadingClean?true:false }>벌칙을 수행하고 반성했습니다</div>
                }
                {!data.amITarget && data.regret &&
                  <Button variant="contained" disabled>이 자는 벌칙을 수행하고 반성했습니다</Button>
                }
              </Stack>
            </div>
          }


          <div className={`${styles.FlexSpace} ${styles.MarginTop}`}>
            {loadingClean ? '...' : <>
              <div>
                {data.claps && data.claps.map((clap, i) => currentUser && clap === currentUser.uid ?
                  <Tooltip key={i} title="나 자신의 손">
                    <span className={styles.Pointer} onDoubleClick={() => handleClap(false)} >👏</span>
                  </Tooltip>
                  :
                  <Tooltip key={i} title={ userMap && userMap[clap] ? userMap[clap].name : '도망자💀'}>
                    <span className={styles.NoSelect}>👏🏽</span>
                  </Tooltip>
                )}
              </div>
              <div>
                {currentUser && place.members.includes(currentUser.uid) &&
                  (!data.claps || (data.claps && !data.claps.includes(currentUser.uid))) &&
                  <Chip label="박수" variant="outlined" size="small" onClick={()=>handleClap(true)} />
                }
              </div>
            </>
            }
          </div>
        </div>
      }
    </>
  )
}

export default Clean