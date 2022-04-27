import { db } from '../firebase'
import { doc, deleteDoc, updateDoc, where, query, collection, getDocs, arrayRemove, getDoc, arrayUnion } from "firebase/firestore";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const usePlace = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)

  // 초대 수락
  const inviOk = async (id) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    await updateDoc(docRef, {
      members: arrayUnion(currentUser.uid),
      membersInvited: arrayRemove(currentUser.uid),
    });
    setLoading(false)
  }

  // 초대 거절
  const inviNo = async (id) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    await updateDoc(docRef, {
      membersInvited: arrayRemove(currentUser.uid),
    });
    setLoading(false)
  }

  const getPlace = async (id) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    const docSnap = await getDoc(docRef);
    setLoading(false)
    if (docSnap.exists()) {
      let data = docSnap.data()
      data.id = docSnap.id
      if(data.members.includes(currentUser.uid)) data.amIMember = true
      return data
    }else return null
  }
  
  const invite = async (id, userId) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    await updateDoc(docRef, {
      membersInvited: arrayUnion(userId),
    });
    setLoading(false)
  }
  const inviteCancel = async (id, userId) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    await updateDoc(docRef, {
      membersInvited: arrayRemove(userId),
    });
    setLoading(false)
  }

  const deletePlace = async (id) => {
    setLoading(true)

    const docRef = doc(db, "places", id);
    // 구역 삭제
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

  const getout = async (id, uid) => {
    setLoading(true)
    const docRef = doc(db, "places", id);
    await updateDoc(docRef, {
      members: arrayRemove(uid),
    });
    setLoading(false)
  }

  return {
    loading, getout, deletePlace, getPlace,
    invite, inviteCancel,
    inviOk, inviNo,
  }
}

export default usePlace