import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Startup from './components/Startup';
import './App.css';
import Preloader from './components/Preloader';
import { Register } from './components';
import Login from './components/Login';
import Startup1 from './components/Startup1';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail'

function App() {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setActive(false);
    }, 2500);
    return () => clearTimeout(timeoutID);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {active ? <Route path="/" element={<Preloader />} /> : <Route path="/" element={<Startup />} />}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Startup1 />} />
        <Route path="/exercise" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
