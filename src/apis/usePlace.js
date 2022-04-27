import { db } from '../firebase'
import { doc, deleteDoc, updateDoc, where, query, collection, getDocs, arrayRemove, getDoc, arrayUnion } from "firebase/firestore";
import { useState } from 'react';

const usePlace = (id) => {
  const [loading, setLoading] = useState(false)
  const docRef = doc(db, "places", id);

  const getPlace = async () => {
    setLoading(true)
    const docSnap = await getDoc(docRef);
    setLoading(false)
    if (docSnap.exists()) {
      let data = docSnap.data()
      data.id = docSnap.id
      return data
    }else return null
  }

  const invite = async (userId) => {
    setLoading(true)
    await updateDoc(docRef, {
      membersInvited: arrayUnion(userId),
    });
    setLoading(false)
  }
  const inviteCancel = async (userId) => {
    setLoading(true)
    await updateDoc(docRef, {
      membersInvited: arrayRemove(userId),
    });
    setLoading(false)
  }

  const deletePlace = async () => {
    setLoading(true)

    // 구역 삭젠
    await deleteDoc(docRef);
    
    // 구역에 속한 청소 삭제
    let q = query(collection(db, "cleans"), where('where', '==', id));
    const snapshots = await getDocs(q);
    await snapshots.forEach(async (d) => {
      const docRef = doc(db, "cleans", d.id);
      await deleteDoc(docRef);
    });

    // 구역에 속한 한마디 삭제
    let qv = query(collection(db, "voices"), where('target', '==', id));
    const snapshotsv = await getDocs(qv);
    await snapshotsv.forEach(async (d) => {
      const docRef = doc(db, "voices", d.id);
      await deleteDoc(docRef);
    });

    setLoading(false)
  }

  const getout = async (uid) => {
    setLoading(true)
    await updateDoc(docRef, {
      members: arrayRemove(uid),
    });
    setLoading(false)
  }

  return { loading, getout, deletePlace, getPlace, invite, inviteCancel }
}

export default usePlace