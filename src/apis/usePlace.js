import { db } from '../firebase'
import { doc, deleteDoc, updateDoc, where, query, collection, getDocs, arrayRemove } from "firebase/firestore";
import { useState } from 'react';

const usePlace = (id) => {
  const [loading, setLoading] = useState(false)

  const deletePlace = async () => {
    const docRef = doc(db, "places", id);
    setLoading(true)
    await deleteDoc(docRef);
    
    let q = query(collection(db, "cleans"), where('where', '==', id));
    const snapshots = await getDocs(q);
    await snapshots.forEach(async (d) => {
      const docRef = doc(db, "cleans", d.id);
      await deleteDoc(docRef);
    });
    setLoading(false)
  }

  const getout = async (uid) => {
    const docRef = doc(db, "places", id);
    setLoading(true)
    await updateDoc(docRef, {
      members: arrayRemove(uid),
    });
    setLoading(false)
  }

  return { loading, getout, deletePlace }
}

export default usePlace