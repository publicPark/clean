import Profile from './pages/Profile';
import Test from './pages/Test';
import Notice from './pages/Notice';
import Invite from './Detail/Invite';
import PlaceForm from './Form/PlaceForm';
import JoinForm from './Form/JoinForm';
import NotFound from './pages/NotFound';
import About from './pages/About';
import PlaceDetail from './Detail/PlaceDetail';
import Icons from './pages/Icons';
import Contact from './pages/Contact';
import Dashboard from './Dashboard/Dashboard';

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CleanForm from './Form/CleanForm';
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react';
import World from './pages/World';

const titles = {
  '/': '즐청: 즐거운 청소',
  '/about': 'About 즐청',
  '/notice': '즐청 Notice',
  '/profile': 'My profile'
}

const Routers = () => {
  const { currentUser } = useAuth()
  const location = useLocation()
  useEffect(() => { document.title = titles[location.pathname] ?? '즐청' },
    [location],
  )

  return (
    <Routes>
      <Route path="/" element={<Dashboard currentUser={currentUser} />} />
      <Route path="/icons" element={<Icons />} />
      <Route path="/about" element={<About />} title='about' />
      <Route path="/contact" element={<Contact />} />
      <Route path="/test" element={<Test />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/world" element={<World />} />
      
      <Route path="place/:id" element={<PlaceDetail />} />
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
  )
}

export default Routers;