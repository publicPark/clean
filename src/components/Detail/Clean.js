import styles from './Clean.module.scss'
import format from 'date-fns/format'
import { useEffect, useState } from 'react';
import differenceInDays from 'date-fns/differenceInDays'
import endOfDay from 'date-fns/endOfDay'

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
import Avatar from '@mui/material/Avatar';

import useClean from '../../apis/useClean';
import { useAuth } from '../../contexts/AuthContext';
import useEmail from "../../apis/useEmail"
import useNotification from '../../apis/useNotification';

const Clean = ({ clean, place, getCleans, index, userMap }) => {
  const { sendEmail } = useEmail()
  const { currentUser } = useAuth()
  const { sendNoti } = useNotification()
  const [data, setData] = useState()
  const [memoForm, setMemoForm] = useState(false)
  const [memo, setMemo] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const [openRegret, setOpenRegret] = useState(false)
  const [openRegret2, setOpenRegret2] = useState(false)
  const [openObjection, setOpenObjection] = useState(false)
  const { loading: loadingClean, setLoading: setLoadingClean, deleteClean, regret, editText, clap, getClean, objection } = useClean()

  const formatClean = (c) => {
    setLoadingClean(false)
    let newData = { ...c }
    let theday = new Date(clean.date.seconds * 1000)
    newData.theday = format(theday, "yyyy-MM-dd") // 청소했던 날
    newData.createdFormatted = format(new Date(clean.created.seconds * 1000), "yyyy-MM-dd")

    // 이의 신청 가능 기간 계산
    let howold = differenceInDays(new Date(), new Date(clean.created.seconds * 1000))
    newData.howold = howold

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

    if (place && clean.objectionWho && userMap && userMap[clean.objectionWho]) {
      newData.objectionWhoText = userMap[clean.objectionWho].name
    } else {
      newData.objectionWhoText = '도망자💀'
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
  }, [clean, currentUser])

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
    if(val && data.who!==currentUser.uid){
      await sendNoti(
        'district-clap',
        [data.who],
        `/place/${place.id}`,
        `${place.name}에서 ${data.theday} 기록된 "${data.text.slice(0,10)}${data.text.length>10?'...':''}" 청소에 👏 박수를 받았어요!`
      )
    }
    const res = await getClean(data.id)
    formatClean(res)
  }

  const handleObjection = async (val, objReason) => {
    await objection(data.id, val, currentUser.uid, objReason)

    if (val) {
      // 메일 보내기
      await sendEmail({
        place_name: place.name,
        place_id: place.id,
        to_email: userMap[data.who].email,
        to_name: userMap[data.who].name,
        from_name: userMap[currentUser.uid].name,
        message: data.createdFormatted,
        reason: objReason
      }, 'objection')

      // 알림 보내기
      await sendNoti(
        'objection',
        place.members,
        `/place/${place.id}`,
        `${objReason} 
        ${place.name}에서 ${data.createdFormatted} 기록된 청소는 인정받지 못했습니다. 🚨 '${data.targetText}' 멤버는 깨끗하게 다시 청소해야합니다!`
      )
    }
    
    getCleans()
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
                  style={{ width: 250, resize: 'none' }}
                  value={memo} onChange={(e) => { setMemo(e.target.value) }}
                />
                {data.amIWriter && <>
                  <IconButton aria-label="delete" size="small" sx={{ ml: 1 }}
                    onClick={ ()=>setMemoForm((cur)=>!cur) }
                  >
                    <CancelIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton aria-label="delete" size="small" sx={{ ml: 1 }}
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
                onClick={() => setMemoForm((cur) => data.amIWriter ? !cur : cur)}
              >
                <Typography variant="body2" sx={{whiteSpace:'pre-line', wordBreak:'break-all'}}>
                  <span className='blur'>"</span>
                  <i>{data.text}</i>
                  <span className='blur'> "</span>
                </Typography>
              </div>
            }
            {!memoForm && <div>
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
            }
          </div>
          <div className={`${styles.MarginTop} ${styles.Dates}`}>
            <div className={styles.Blur}>
              <span className={data.objection ? styles.LineThrough : undefined}>cleaned <b>{data.theday}</b>
                {/* {!data.objection && typeof data.howlong === 'number' && (
                  data.howlong===0?<span> (또청소)</span> :<span> ({ data.howlong }일 만에 청소)</span>  
                )} */}
              </span>
              {data.objection && <b className='accent'> ❌ 무효!</b>}
            </div>
            <div className={styles.Blur}>
              wrote <span className={ data.theday !== data.createdFormatted? styles.ColorAccent2:undefined }>{ data.createdFormatted }</span>
            </div>
            <div className={`${styles.Blur} ${styles.FlexSpace}`}>
              <div className={ styles.Flex }>
                by
                { userMap[data.who]?
                  <Avatar alt={ userMap[data.who].name }
                    src={userMap[data.who].photoURL}
                    sx={{ width: 24, height: 24, m:.6 }}
                  />
                  :
                  <Avatar alt={ '도망자' }
                    src={''}
                    sx={{ width: 24, height: 24, m:.6 }}
                  />
                }
                
                <div>
                  <b className={currentUser && currentUser.uid === data.who ? 'accent3' : ''}>{data.whoText}</b>
                  { data.target && data.target !== data.who &&
                    <> for <span className={currentUser && currentUser.uid === data.target ? 'accent3' : ''}>{data.targetText}</span>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* 심판 받아야하는 경우 */}
          {data.judgement > 0 && !data.objection &&
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
                  callback={() => handleRegret(false)}
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

          <ConfirmDialog
            msg2={ data.objection?"정당하고 유효한 기록으로 다시 인정됩니다.":"존경하는 재판장님 이의있습니다!\n거짓된 증언, 그리고 더러운 청소는\n이 마을을 위협하는 일입니다!"}
            msg1={ data.objection?"이의를 철회하시겠습니까?":"이의 신청서" }
            confirmText={data.objection?"정말로 철회":"정말로 완료"}
            open={openObjection}
            setOpen={setOpenObjection}
            callback={(objReason)=>data.objection?handleObjection(false, objReason):handleObjection(true, objReason)}
            isForm={data.objection?false:true}
            formLabel={"상세 사유"}
          />

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
              {currentUser && place.members.includes(currentUser.uid) && !data.objection &&
                <div>
                  {index === 0 && // 이의 신청 가능
                    data.who !== currentUser.uid &&
                    data.howold < 1 && (!data.claps?.includes(currentUser.uid)) &&
                    <Chip
                      sx={{ mr:1 }}
                      label="이의있음!"
                      variant="outlined" size="small"
                      onClick={()=>setOpenObjection(true)}
                    />
                  }
                  {(!data.claps?.includes(currentUser.uid)) && data.who !== currentUser.uid &&
                    <Chip label="박수" variant="outlined" size="small" onClick={() => handleClap(true)} />
                  }
                </div>
              }
              {data.objection &&
                <Chip
                label={<>
                  {data.objectionWho &&
                    <>
                      <span className={currentUser && currentUser.uid === data.objectionWho ? 'accent3':''}>
                        {data.objectionWhoText}
                      </span>
                      <span>님의</span>
                    </>
                  }
                  <span> 이의제기</span>
                </>}
                variant="outlined" size="small" color="primary"
                onClick={index === 0 && currentUser &&
                  data.objectionWho === currentUser.uid ? () => setOpenObjection(true) : undefined}
                />
              }
            </>
            }
          </div>
        </div>
      }
    </>
  )
}

export default Clean