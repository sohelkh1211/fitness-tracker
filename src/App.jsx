import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Preloader, Register, Login, Startup, Startup1, Profile } from './components';
import Provider from './context/Provider';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import ProtectedRoute from './context/ProtectedRoute';

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
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Startup1 />} />
        </Route>
        <Route path="/exercise" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        {/* Due to react-router-dom v6, All the children of Routes nust be Route only.
        Hence, we can't directly put ProtectedRoute instead of Route. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user/profile" element={<Provider><Profile /></Provider>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
