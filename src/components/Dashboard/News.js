import { db } from '../../firebase'
import { collection, getDocs } from "firebase/firestore"; 
import { useEffect, useState } from 'react';

const News = () => {
  const [cleans, setCleans] = useState([])
  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "cleans"));
    let arr = []
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      arr.push(doc.data())
    });
    setCleans(arr)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <h2>최근 이벤트</h2>
      {JSON.stringify(cleans)}
    </>
  )
}

export default News