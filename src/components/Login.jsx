import React, { useState, useContext } from 'react';
import fitness_bg from '../assets/bg1.jpg'; {/* Background image */ }
import { auth } from '../firebase'; {/* For firebase authentication */ }
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast'; {/* For toast notification. */ }

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const navigate = useNavigate();

  // To set "user" to true if he is an authorized user.
  const { setUser } = useContext(GlobalContext);

  const signIn = (e) => {
    e.preventDefault();
    // console.log(email, password);
    if (!email || !password) {
      alert("Please enter credentials.");
    }
    else {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // console.log(userCredential);
        // setLogin(true);
        toast.success("Logged in Successfully");
        setUser(true);
        navigate("/home", { replace: true });
      })
        .catch((error) => {
          // console.log(error);
          switch (error.code) {
            case "auth/invalid-credential":
              toast.error("Invalid Email or Password");
              break
            default:
              toast.error("Error occured ", error);
              console.log(error.message);
              break;
          }
        });
    }
  }
  return (
    <>
      <img src={fitness_bg} className='fixed top-0 left-0 sm:h-full sm:w-full xs:w-full xs:h-full object-cover blur-sm ' />
      <div className='relative flex mx-auto sm:w-[600px] sm:h-[400px] xs:w-[300px] xs:h-[300px] rounded-lg container'>
        <form method='POST' onSubmit={signIn}>
          <div className='flex sm:ml-[240px] xs:ml-[90px] border-none border-black sm:mt-20 xs:mt-10 w-fit'>
            <h1 className='sm:text-[35px] xs:text-[25px] font-bold'>Log In</h1>
          </div>
          <div className='absolute sm:mt-8 xs:mt-4 sm:ml-[110px] xs:ml-[21px] sm:pl-[20px] xs:pl-[5px] pb-4 pt-6 flex flex-col sm:w-[350px] xs:w-[210px] justify-between gap-y-4 xs:border-none sm:border-[1.4px] border-black'>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className='sm:w-[300px] xs:w-[200px] rounded-md pl-1.5 sm:py-2 xs:py-1 bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black placeholder-color' />
            <div className='relative flex mt-[5px]'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className='sm:w-[300px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1.5 sm:py-2 xs:py-1 placeholder-color'
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute sm:right-10 sm:top-3.5 xs:right-4 xs:top-2.5 cursor-pointer"
              />
            </div>
            <button type='submit' className='border mt-2 w-fit mx-auto px-10 py-2 bg-emerald-300 border-green-400 rounded-md'>Log In</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login
