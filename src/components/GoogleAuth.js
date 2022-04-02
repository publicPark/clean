import  { useAuth } from '../contexts/AuthContext'

const GoogleAuth = () => {
  const { googleAuth } = useAuth()
  const handleGoogleAuth = (e) => {
    googleAuth()
  }
  return (
    <div>
      <div>
        <button onClick={handleGoogleAuth}>구글로긴</button>
      </div>
    </div>
  )
}

export default GoogleAuth;