import { db } from '../firebase'
import {
  doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc,
} from "firebase/firestore";
import { useState } from 'react';

const useClean = () => {
  const [loading, setLoading] = useState(false)

  const getClean = async (id) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    const snap = await getDoc(docRef);
    setLoading(false)
    let data = snap.data()
    data.id = snap.id
    return data
  }

  const deleteClean = async (id) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    await deleteDoc(docRef);
    setLoading(false)
  }

  const regret = async (id, val) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    await updateDoc(docRef, {
      regret: val,
    });
    // setLoading(false)
  }

  const editText = async (id, val) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    await updateDoc(docRef, {
      text: val,
    });
    // setLoading(false)
  }

  const clap = async (id, val, uid) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    if (val) {
      console.log('arrayunion')
      await updateDoc(docRef, {
        claps: arrayUnion(uid),
      });
    } else {
      console.log('arrayRemove')
      await updateDoc(docRef, {
        claps: arrayRemove(uid),
      });
    }
    // setLoading(false)
  }

  const objection = async (id, val, userId) => {
    const docRef = doc(db, "cleans", id);
    setLoading(true)
    await updateDoc(docRef, {
      objection: val,
      objectionWho: userId
    });
    // setLoading(false)
  }

  return { loading, setLoading, deleteClean, regret, editText, clap, getClean, objection }
}

export default useClean