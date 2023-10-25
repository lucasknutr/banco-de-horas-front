import './App.css'
import CheckIn from './pages/CheckIn';
import Home from './pages/Home'
import { BrowserRouter as Switch, Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Routes>    
    </>
  )
}

export default App
