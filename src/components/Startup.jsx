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
            <div className='fixed flex top-0 z-20 w-full left-0 lg:h-[60px] bg-white rounded-md border justify-between items-center'>
                <p className='px-[30px] py-[14px] text-[18px] font-semibold'>Healthify</p>
                <div className='flex justify-between gap-4 px-5'>
                    <Link className='border border-black bg-green-500 rounded-md px-2 py-1 hover:scale-[1.1]' to="/login">Login</Link>
                    <Link className='border border-black bg-red-400 rounded-md px-2 py-1 hover:scale-[1.1]' to="/register">Register</Link>
                </div>
            </div>
            <div className='relative grid sm:grid-cols-2 xs:grid-rows-2 sm:top-[80px] xs:top-[40px] border-none border-emerald-400'>
                <div className='flex flex-col text-left lg:w-[400px] md:w-[350px] xs:w-full xs:order-2 border-none border-cyan-400'>
                    <h1 className='lg:text-[50px] md:text-[40px] sm:text-[35px] xs:text-[30px] pb-4'>Monitor your fitness data</h1>
                    <p className='sm:text-[20px] xs:text-[18px] lg:w-[420px] pb-4 border-none border-purple-400'>Achieve your fitness goals with healthify app.</p>
                    <button onClick={() => navigate("/register")} className='text-left w-fit px-4 py-1 rounded-lg text-white bg-black border border-black'>Get Started</button>
                </div>
                <div className='flex border-none border-blue-500 pt-6 lg:pl-44 sm:order-2 xs:order-1'>
                    <img src={exercise_image} className='lg:w-[350px] sm:h-[220px] lg:ml-0 xs:mx-auto object-cover rounded-xl' />
                </div>
            </div>
            <Footer1 />
        </>
    )
}

export default Startup
