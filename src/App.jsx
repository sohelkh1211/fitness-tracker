import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Preloader, Register, Login, Startup, Startup1, Profile } from './components';
import Provider from './components/Provider';
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
        <Route path='/profile' element={<Provider><Profile /></Provider>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
