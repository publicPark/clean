import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";import { db } from '../../firebase'
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from './Place.module.scss'

import usePlace from '../../apis/usePlace';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';  
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import Users from "./Users";
import getMobileOS from '../../apis/getMobileOS'
const os = getMobileOS()

const userRef = collection(db, "users")

const Invite = () => {
  let { id } = useParams();
  let [place, setPlace] = useState(null)
  let [searchText, setSearchText] = useState('')
  let [err, setErr] = useState('')
  let [msg, setMsg] = useState('')
  let [list, setList] = useState('')
  let [loading, setLoading] = useState('')
  const { loading: loadingPlace, getPlace } = usePlace(id)
  const [showCode, setShowCode] = useState(false)

  const initPlace = async () => {
    const data = await getPlace(id)
    if (!data) {
      setErr('구역을 불러 올 수 없습니다')
      return
    }
    if (!data.amIMember) {
      setErr('나는 이 구역의 멤버가 아닙니다')
      return
    }
    setPlace(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return
    if(!searchText) return
    // console.log(searchText)
    initPlace()

    setLoading(true)
    setMsg('')
    setList([])
    const q = query(userRef, where('name', '>=', searchText), where('name', '<=', searchText + '\uf8ff'));
    const snaps = await getDocs(q);
    if (!snaps.size) setMsg(`'${searchText}' 검색 결과가 없습니다`)
    let arr = []
    snaps.forEach(async (d) => {
      // console.log(d.data())
      arr.push(d.data())
    });
    setList(arr)
    setLoading(false)
  }

  const onShowCode = () => { 
    navigator.clipboard.writeText(id)
    setShowCode((cur)=>!cur)
  }

  useEffect(() => {
    initPlace()
    return
  }, [])

  return <>
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{mt:2}}
    >
      <h1>초대하기</h1>
      {/* <Box sx={{ minWidth: 275, maxWidth: 360, p: 1 }}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {place.name}
          </Typography>
        </Card>
      </Box> */}
      {!place && loadingPlace ? <CircularProgress sx={{ m: 2 }} color="primary" /> :
        <Box sx={{ minWidth: 275, maxWidth: 360, p: 1 }}>
          {err ?
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                {err}
              </Typography>
            </Card>
          : place &&
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              {place.name}
            </Typography>
            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
              초대할 주민 이름을 입력하고 엔터 
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <TextField id="user-search" label="정확한 이름이 좋아" variant="outlined" fullWidth
                value={searchText} onChange={(e)=>setSearchText(e.target.value)}
                />
              </Stack>
            </form>
            
            <Typography
              color="text.secondary"
              component="div" sx={{ mt:2, p:1 }}
            >
              {msg}
            </Typography>
            {loading && <CircularProgress sx={{ mt: 2 }} color="primary" />}
            {list && <Users users={list} place={place} />}
          </Card>
        }
        </Box>
      }

      {place &&
        <>
          <div className={ styles.Blur }>OR</div>
          <div>
            <code className={styles.Label} onClick={onShowCode}>
              {showCode ?
                <>
                  <span>Copied! </span><span className={styles.Code}>{id}</span>
                </>
                : <span>Code?</span>
              }
            </code>
          </div>
          {(os === 'iOS' || os === 'Mac') &&
            <a href={`sms:&body=${place.name}에 귀하를 초대합니다. https://publicpark.github.io/clean/#/place/${id}`}>
              <Button variant="outlined" color="info">SMS 보내기</Button>
            </a> 
          }
          {os === 'Android' &&
            <a href={`sms:?body=${place.name}에 귀하를 초대합니다. https://publicpark.github.io/clean/#/place/${id}`}>
              <Button variant="outlined" color="info">SMS 보내기</Button>
            </a> 
          }
        </>
      }
    </Stack>
  
  </>
}
export default Invite