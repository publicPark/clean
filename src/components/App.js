import { AuthProvider } from '../contexts/AuthContext';
import './App.css';
import GoogleAuth from './GoogleAuth';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className="SmallContainer">
          <GoogleAuth />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
