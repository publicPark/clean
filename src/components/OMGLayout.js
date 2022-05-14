import './App.scss';
import { Routes, Route } from "react-router-dom";
import OMG from './pages/OMG';

const OMGLayout = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<OMG />} />
      </Routes>
    </>
  );
}

export default OMGLayout;
