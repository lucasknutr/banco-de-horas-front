import './App.css'
import CheckIn from './pages/CheckIn';
import Home from './pages/Home'
// @ts-ignore
import { BrowserRouter as Switch, Route, Routes } from "react-router-dom";
import ParticlesBg from 'particles-bg';
import { useState, useEffect } from 'react';
import QrCodeGenerator from './pages/QrCodeGenerator';
import { useNavigate } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState<string>("");
  // @ts-ignore
  const [auth, setAuth] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('email')) {
      setAuth(true);
      navigate("/banco-de-horas-front/checkin");
    }
  }, []);
  return (
    <>
      <ParticlesBg type="lines" bg={true} />
      <Routes>
        
        <Route path="/banco-de-horas-front" element={
          // @ts-ignore
          <Home />
        } />
        <Route path="/banco-de-horas-front/checkin" element={
          <CheckIn email={email} setEmail={setEmail} />
        } /> 
        <Route path="/banco-de-horas-front/qrcode" element={
          <QrCodeGenerator email={email} />
        } />

      </Routes>    
    </>
  )
}

export default App
