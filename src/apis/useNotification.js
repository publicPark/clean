import { db } from '../../firebase'
import { collection, addDoc } from "firebase/firestore"; 
import { useState } from 'react';

const docRef = collection(db, "notifications");

const useNotification = () => {
  const [loading, setLoading] = useState(false)

  // 해방시
  const sendNoti = async (type, to, url, content) => {
    setLoading(true)
    let obj = {
      type: type,
      to: to, // array
      url: url,
      date: new Date(),
      content: content,
    }
    await addDoc(docRef, obj)
    setLoading(false)
  }

  return {
    loading,
    sendNoti, 
  }
}

export default useNotification;