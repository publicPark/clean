import  { useAuth } from '../contexts/AuthContext'

const GoogleAuth = () => {
  const { googleAuth, currentUser, userSignOut } = useAuth()
  const handleGoogleAuth = (e) => {
    googleAuth()
  }
  const handleSignOut = () => {
    userSignOut()
  }
  return (
    <div>
      {currentUser ?
        <div>
          <div>{currentUser.displayName}</div>
          <div>
            <button onClick={handleSignOut}>로그아웃</button>
          </div>
        </div>
        :
        <div>
          <button onClick={handleGoogleAuth}>구글로긴</button>
        </div>
      }
    </div>
  )
}

export default GoogleAuth;