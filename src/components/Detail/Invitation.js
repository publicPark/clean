import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";import { db } from '../../firebase'
import { collection, getDocs, query, where } from "firebase/firestore";

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

const Invitation = () => {
  let { id } = useParams();
  let [place, setPlace] = useState(null)
  let [searchText, setSearchText] = useState('')
  let [err, setErr] = useState('')
  let [msg, setMsg] = useState('')
  let [list, setList] = useState('')
  let [loading, setLoading] = useState('')
  const { loading: loadingPlace, getPlace } = usePlace(id)

  const initPlace = async () => {
    const data = await getPlace()
    if(!data) setErr('구역을 불러 올 수 없습니다')
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
      <h1>초대하기는 지금 공사중</h1>
      {place &&
        <>
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
      {!place && loadingPlace ? <CircularProgress sx={{ m: 2 }} color="primary" /> :
        <Box sx={{ minWidth: 275, maxWidth: 360, p: 1 }}> { err ? { err } : place &&
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
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
            {list && <Users users={list} place={place} />}
          </Card>
        }
        </Box>
      }
    </Stack>
  
  </>
}
export default Invitation