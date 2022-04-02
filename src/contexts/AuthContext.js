import { createContext, useContext, useEffect, useState } from "react"
import { auth } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
const provider = new GoogleAuthProvider();

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()

  const googleAuth = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      setCurrentUser(user)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged", user)
      if (user) {
      } else {
      }
    });
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    googleAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

