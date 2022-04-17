import { db } from '../firebase'
import { doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from 'react';

const useClean = () => {
  const [loading, setLoading] = useState(false)

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
    setLoading(false)
  }

  return { loading, deleteClean, regret }
}

export default useClean