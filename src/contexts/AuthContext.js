import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from '../firebase'
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
const provider = new GoogleAuthProvider();

console.log('AuthContext')
const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  const googleAuth = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  
  const userSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      setCurrentUser(null)
    }).catch((error) => {
      // An error happened.
    });
  }

  const userUpdate = async (data) => {
    await updateProfile(currentUser, data)
    writeUser({...currentUser, data})
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
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged", user)
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
    userUpdate
  }

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  )
}

