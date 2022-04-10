import './App.scss';
import Dashboard from './Dashboard/Dashboard';
import Navbar from './Navbar';
import {useTheme} from '../contexts/ThemeContext'
import { Routes, Route, Navigate } from "react-router-dom";
import CleanForm from './Form/CleanForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import  { useAuth } from '../contexts/AuthContext'
import PlaceForm from './Form/PlaceForm';
import JoinForm from './Form/JoinForm';
import NotFound from './pages/NotFound';
import About from './pages/About';
import PlaceDetail from './Dashboard/PlaceDetail';
import Questions from './pages/Questions';
import Contact from './pages/Contact';

function App({ user }) {
  const { currentUser } = useAuth()
  const { darkTheme } = useTheme()
  
  const themeMui = createTheme({
    palette: {
      primary: {
        main: '#ff4400',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
      mode: darkTheme ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={themeMui}>
      <div className={`App ${darkTheme?'dark':undefined}`}>
        <div className="">
          <Navbar currentUser={currentUser} />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard currentUser={currentUser} />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {currentUser ?
            <>
              <Route path="place/:id" element={<PlaceDetail currentUser={ currentUser }/>} />
              <Route path="placeform" element={<PlaceForm currentUser={ currentUser }/>} />
              <Route path="placeform/:id" element={<PlaceForm currentUser={currentUser}/>} />
              <Route path="placejoin" element={<JoinForm currentUser={ currentUser }/>} />
              <Route path="cleaned/:id" element={<CleanForm currentUser={currentUser} />} />
              <Route path="*" element={<NotFound />} />
            </>
            :
            <Route path="*" element={<Navigate replace to="/" />} />
          }
        </Routes>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
