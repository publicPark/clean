import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from '../firebase'
import { setDoc, doc } from "firebase/firestore"; 
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
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

  const writeUser = async (u) => {
    const docRef = doc(db, "users", u.uid);
    const docRefNew = await setDoc(docRef, {
      id: u.uid,
      name: u.displayName,
      photoURL: u.photoURL
    });
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
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    googleAuth,
    userSignOut
  }

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  )
}

