import './App.css'
import CheckIn from './pages/CheckIn';
import Home from './pages/Home'
import { BrowserRouter as Switch, Route, Routes } from "react-router-dom";
import ParticlesBg from 'particles-bg';

function App() {

  return (
    <>
      <ParticlesBg type="lines" bg={true} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Routes>    
    </>
  )
}

export default App
