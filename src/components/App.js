
import './App.css';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import {useTheme} from '../contexts/ThemeContext'

function App() {
  const {darkTheme} = useTheme()
  return (
    <div className={`App ${darkTheme&&'dark'}`}>
      <div className="">
        <Navbar />
      </div>
      <Dashboard />
    </div>
  );
}

export default App;
