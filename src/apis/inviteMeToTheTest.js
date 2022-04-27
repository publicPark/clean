import { db } from '../firebase'
import { doc, updateDoc, where, query, getDocs, arrayUnion, collection, limit } from "firebase/firestore";

const placesRef = collection(db, "places");

export const inviteMeToTheTest = async (uid) => {
  // 구역이 하나도 없으면 초대할거임
  const pq = query(placesRef, where("members", "array-contains", uid), limit(1))
  const snaps = await getDocs(pq);
  if(snaps.size>0) return

  // 테스트 구역 초대
  let q = query(placesRef, where("test", "==",  true));
  const snapshots = await getDocs(q);
  await snapshots.forEach(async (d) => {
    const pRef = doc(db, "places", d.id);
    await updateDoc(pRef, {
      membersInvited: arrayUnion(uid),
    });
  });
  return
}
