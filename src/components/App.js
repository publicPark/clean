import './App.scss';
import Dashboard from './Dashboard/Dashboard';
import Navbar from './Navbar';
import {useTheme} from '../contexts/ThemeContext'
import { Routes, Route } from "react-router-dom";
import CleanForm from './Form/CleanForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import  { useAuth } from '../contexts/AuthContext'
import PlaceForm from './Form/PlaceForm';

function App({ user }) {
  const { currentUser } = useAuth()
  const { darkTheme } = useTheme()
  
  const themeMui = createTheme({
    palette: {
      primary: {
        main: '#ff4400',
      },
      mode: darkTheme ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={themeMui}>
      <div className={`App ${darkTheme&&'dark'}`}>
        <div className="">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard currentUser={currentUser} />} />
          <Route path="place" element={<PlaceForm currentUser={ currentUser }/>} />
          <Route path="clean" element={<CleanForm currentUser={ currentUser }/>} />
        </Routes>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
