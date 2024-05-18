import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Preloader, Register, Login, Startup, Startup1, Profile } from './components';
import Provider from './context/Provider';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import ProtectedRoute from './context/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

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
      <Toaster toastOptions={{
        className: 'font-bold border-[2px]',
        success: {
          duration: 5000,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
          style: {
            color: '#047857',
            borderColor: '#059669',
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#FFFAEE'
          },
          style: {
            color: '#f52f2f',
            borderColor: '#EF4444',
          },
        }
      }}
      />
      <Routes>
        {active ? <Route path="/" element={<Preloader />} /> : <Route path="/" element={<Startup />} />}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Provider><Login /></Provider>} /> {/* Provider is needed to access setUser callback function. */}
        {/* Due to react-router-dom v6, All the children of Routes nust be Route only.
        Hence, we can't directly put ProtectedRoute instead of Route. */}
        <Route element={<Provider><ProtectedRoute /></Provider>}> {/* Using provider to access global state variable "user, setUser" inside ProtectedRoute.*/}
          <Route path='/home' element={<Startup1 />} />
          <Route path="/user/profile" element={<Provider><Profile /></Provider>} />
        </Route>
        <Route path="/exercise" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
