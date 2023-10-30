import './App.css'
import CheckIn from './pages/CheckIn';
import Home from './pages/Home'
import { BrowserRouter as Switch, Route, Routes } from "react-router-dom";
import ParticlesBg from 'particles-bg';
import { useState } from 'react';
import QrCodeGenerator from './pages/QrCodeGenerator';

function App() {
  const [email, setEmail] = useState<string>("");
  return (
    <>
      <ParticlesBg type="lines" bg={true} />
      <Routes>
        <Route path="/" element={
          <Home email={email} setEmail={setEmail} />
        } />
        <Route path="/checkin" element={
          <CheckIn email={email} setEmail={setEmail} />
        } />
        <Route path="/qrcode" element={
          <QrCodeGenerator email={email} />
        } />

      </Routes>    
    </>
  )
}

export default App
