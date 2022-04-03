import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

import { db } from '../../firebase'
import { collection, getDocs } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { query, where } from "firebase/firestore";

const placesRef = collection(db, "places");

const Places = ({ currentUser }) => {
  const [list, setList] = useState([])
  
  const getData = async () => {
    if (currentUser) {
      const q = query(placesRef, where("members", "array-contains", currentUser.uid));
      const querySnapshot = await getDocs(q);
      let arr = []
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        arr.push(doc.data())
      });
      setList(arr)
    }
  }

  useEffect(() => {
    getData()
  }, [currentUser])

  return (
    <>
      <div>
        <h2>구역들</h2>
        {JSON.stringify(list)}
        {list.map((p, i) => <div key={ i }>
          <h4>{p.name} ({p.members.length}명) - 최대 {p.days}일</h4>
          <Button variant="outlined">수정</Button>
        </div>)}
      </div>
      <div>
        <Link to="/place"><Button variant="contained">청소 구역 생성</Button></Link>
      </div>
    </>
  )
}

export default Places