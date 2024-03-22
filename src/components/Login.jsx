import React, { useState } from 'react';
import fitness_bg from '../assets/bg1.jpg';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    // console.log(email, password);
    signInWithEmailAndPassword(auth,email,password).then((userCredential) => {
        // console.log(userCredential);
        alert("Authorized User");
        navigate("/home");
    })
    .catch((error) => {
        // console.log(error);
        alert("Unauthorized User");
    });
}
  return (
    <>
      <img src={fitness_bg} className='fixed top-0 left-0 h-full w-full object-cover blur-sm ' />
      <div className='relative flex mx-auto w-[600px] h-[400px] rounded-lg container'>
          <form method='POST' onSubmit={signIn}>
            <div className='flex ml-[240px] border-none border-black mt-20 w-fit'>
              <h1 className='text-[35px] font-bold'>Log In</h1>
            </div>
            <div className='absolute mt-8 ml-[110px] pl-[10px] pb-4 flex flex-col w-[350px]  pt-6 justify-between gap-y-4 border-[1.4px] border-black'>
              <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className='w-[300px] rounded-md pl-1.5 py-2 bg-transparent border-[1.4px] border-black' />
              <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className='w-[300px] rounded-md pl-1.5 py-2 bg-transparent border-[1.4px] border-black' />
              <button type='submit' className='border w-fit mx-auto px-10 py-2 bg-emerald-300 border-green-400 rounded-md'>Log In</button>
            </div>
          </form>
      </div>
    </>
  )
}

export default Login
