import { db } from '../../firebase'
import { collection, getDocs, query, orderBy, limit, doc, deleteDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import format from 'date-fns/format'
import { useNavigate } from "react-router-dom";

const News = ({ currentUser, maxCount=3 }) => {
  let navigate = useNavigate();
  const [cleans, setCleans] = useState([])
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    const cRef = collection(db, "cleans");
    const q = query(cRef, orderBy("created", "desc"), limit(maxCount));
    const querySnapshot = await getDocs(q);
    let arr = []
    querySnapshot.forEach((doc) => {
      let obj = { ...doc.data(), id: doc.id}
      arr.push(obj)
    });
    setCleans(arr)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleClick = (data) => {
    console.log("??", data)
    handleDelete(data.id)
  }

  // 삭제하기
  const handleDelete = async (id) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    await deleteDoc(docRef);
    setLoading(false)
    getData()
  }

  return (
    <>
      <h2>최근 최대 {maxCount}개의 사건 (테스트)</h2>
      {cleans.map((c, i) => {
        return <div key={i}>
          {/* {JSON.stringify(c)} */}
          <div>memo: {c.text}</div>
          <div>date: {format(new Date(c.date.seconds*1000), "yyyy-MM-dd")}</div>
          <div>created: {format(new Date(c.created.seconds * 1000), "yyyy-MM-dd hh:mm:ss")}</div>
          <div>who: {c.who}</div>
          {currentUser && currentUser.uid === c.who && !loading &&
            <button onClick={() => handleClick(c)}>귀찮아</button>
          }
        </div>
      })}
    </>
  )
}

export default News