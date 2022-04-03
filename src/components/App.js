import './App.scss';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import {useTheme} from '../contexts/ThemeContext'
import { Routes, Route } from "react-router-dom";
import CleanForm from './CleanForm';

function App() {
  const {darkTheme} = useTheme()
  return (
    <div className={`App ${darkTheme&&'dark'}`}>
      <div className="">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="clean" element={<CleanForm />} />
      </Routes>
      
    </div>
  );
}

export default App;
