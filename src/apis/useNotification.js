import { db } from '../firebase'
import { collection, addDoc, arrayRemove, arrayUnion, doc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { useState } from 'react';

const docRef = collection(db, "notifications");

const useNotification = () => {
  const [loading, setLoading] = useState(false)

  // 보내기
  const sendNoti = async (type, to, url, content) => {
    setLoading(true)
    let obj = {
      type: type,
      to: to, // array
      toRead: [],
      url: url,
      date: new Date(),
      content: content,
    }
    await addDoc(docRef, obj)
    setLoading(false)
  }

  // 삭제
  const deleteNoti = async (noti, userId, remove = false) => {
    setLoading(true)
    const docRef = doc(db, "notifications", noti.id);
    let obj = {}
    obj = {
      to: arrayRemove(userId)
    }
    if (remove) {
      await deleteDoc(docRef)
    } else {
      await updateDoc(docRef, obj);
    }
    setLoading(false)
  }

  // 읽음
  const readNoti = async (id, userId) => {
    setLoading(true)
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, {
      // to: arrayRemove(userId),
      toRead: arrayUnion(userId)
    });
    setLoading(false)
  }

  return {
    loading,
    sendNoti,
    deleteNoti,
    readNoti
  }
}

export default useNotification;