import './App.scss';
import Dashboard from './Dashboard/Dashboard';
import Navbar from './Layout/Navbar';
import { Routes, Route, Navigate } from "react-router-dom";
import CleanForm from './Form/CleanForm';
import  { useAuth } from '../contexts/AuthContext'
import PlaceForm from './Form/PlaceForm';
import JoinForm from './Form/JoinForm';
import NotFound from './pages/NotFound';
import About from './pages/About';
import PlaceDetail from './Detail/PlaceDetail';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import BrowserDetect from './Layout/BrowserDetect';
import Profile from './pages/Profile';
import Test from './pages/Test';
import Notice from './pages/Notice';
import Invite from './Detail/Invite';
import Error from './pages/Error';

function Layout() {
  const { currentUser } = useAuth()

  return (
    <>
      <div className="">
        <Navbar currentUser={currentUser} />
      </div>
      <div>
        <BrowserDetect />
      </div>
      <Routes>
        {/* <Route path="*" element={ <Error /> } /> */}
        <Route path="/" element={<Dashboard currentUser={currentUser} />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/test" element={<Test />} />
        <Route path="/notice" element={<Notice />} />
        
        <Route path="place/:id" element={<PlaceDetail currentUser={currentUser} />} />
        <Route path="cleaned/:id" element={<CleanForm currentUser={currentUser} />} />
        <Route path="placejoin" element={<JoinForm currentUser={currentUser} />} />

        <Route path="profile" element={ currentUser ? <Profile /> : <NotFound status="auth" />} />
        <Route path="invite/:id" element={ currentUser ? <Invite /> : <NotFound status="auth" />} />
        <Route path="placeform/:id" element={ currentUser ? <PlaceForm currentUser={currentUser}/>  : <NotFound status="auth" />} />
        {currentUser ?
          <>
            <Route path="placeform" element={<PlaceForm currentUser={ currentUser }/>} />
            <Route path="*" element={<NotFound />} />
          </>
          :
          <Route path="*" element={<Navigate replace to="/" />} />
        }
      </Routes>
    </>
  );
}

export default Layout;
