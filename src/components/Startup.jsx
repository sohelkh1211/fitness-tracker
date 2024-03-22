import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import exercise_image from '../assets/pushup.jpg'
import Footer from './Footer1';
import Footer1 from './Footer1';

const Startup = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='fixed flex top-0 z-20 w-full left-0 h-[60px] bg-white rounded-md border justify-between items-center'>
                <p className='px-[30px] py-[14px] text-[18px] font-semibold'>Healthify</p>
                <div className='flex justify-between gap-4 px-5'>
                    <Link className='border border-black bg-green-500 rounded-md px-2 py-1 hover:scale-[1.1]' to="/login">Login</Link>
                    <Link className='border border-black bg-red-400 rounded-md px-2 py-1 hover:scale-[1.1]' to="/register">Register</Link>
                </div>
            </div>
            <div className='relative grid grid-cols-2 top-[80px] border-none border-emerald-400'>
                <div className='flex flex-col text-left w-[400px] border-none border-cyan-400'>
                    <h1 className='text-[50px] pb-4'>Monitor your fitness data</h1>
                    <p className='text-[20px] w-[420px] pb-4 border-none border-purple-400'>Achieve your fitness goals with healthify app.</p>
                    <button onClick={() => navigate("/register")} className='text-left w-fit px-4 py-1 rounded-lg text-white bg-black border border-black'>Get Started</button>
                </div>
                <div className='flex border-none border-blue-500 pt-6 pl-44'>
                    <img  src={exercise_image} className='w-[350px] h-[220px] rounded-xl'/>
                </div>
            </div>
            <Footer1 space_above={501}  />
        </>
    )
}

export default Startup
