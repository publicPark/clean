import './App.scss';
import Navbar from './Layout/Navbar';
import  { useAuth } from '../contexts/AuthContext'
import BrowserDetect from './Layout/BrowserDetect';
import Routers from './Routers';

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
      <Routers />
    </>
  );
}

export default Layout;
