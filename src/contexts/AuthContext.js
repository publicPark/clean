import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from '../firebase'
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { inviteMeToTheTest } from "../apis/inviteMeToTheTest";
import Comet from "../components/Layout/Comet";
const provider = new GoogleAuthProvider();

const AuthContext = createContext()
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [userDetail, setUserDetail] = useState()
  const [loading, setLoading] = useState(true)

  const googleAuth = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      inviteMeToTheTest(user.uid)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  }
  
  const userSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      setCurrentUser(null)
    }).catch((error) => {
      console.log(error)
    });
  }

  const userUpdate = async (data) => {
    setLoading(true)
    await updateProfile(currentUser, data)
    await writeUser({...currentUser, data})
    setLoading(false)
  }

  const writeUser = async (u) => {
    const docRef = doc(db, "users", u.uid);
    const userDocSnap = await getDoc(docRef);
    const userData = userDocSnap.data()
    let obj = {
      id: u.uid,
      name: u.displayName,
      photoURL: u.photoURL,
      email: u.email,
      lastDate: new Date()
    }
    if (userData) {
      obj = { ...userData, ...obj }
      if (!userData.originalPhotoURL) {
        obj.originalPhotoURL = u.photoURL
      }
      if (!userData.originalName) {
        obj.originalName = u.displayName
      }
    } 
    await setDoc(docRef, obj);
    setUserDetail(userData)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("onAuthStateChanged", user)
      setLoading(false)
      setCurrentUser(user)
      if (user) {
        writeUser(user)
      }
    });
    return () => unsubscribe()
  }, [])


  const value = {
    loading, 
    currentUser,
    googleAuth,
    userSignOut,
    userUpdate,
    userDetail
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Comet /> : children}
      {/* {children} */}
    </AuthContext.Provider>
  )
}

