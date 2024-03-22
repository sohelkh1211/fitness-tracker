import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import pic from '../assets/pullup.jpg';
import pic1 from '../assets/deadlift.jpg';
import pic2 from '../assets/pushup.jpg';
import { useNavigate } from 'react-router-dom';

const Startup1 = () => {
    const [toggle, setToggle] = useState(false);
    console.log(toggle);
    const navigate = useNavigate();
    return (
        <>
            <div className='fixed flex top-0 z-20 w-full left-0 h-[60px] bg-white rounded-md border justify-start items-center'>
                <p className='px-[30px] py-[14px] text-[18px] font-semibold'>Healthify</p>
                <div className='sm:flex xs:hidden justify-between gap-8 ml-[32%] border-none border-black'>
                    <Link to="/home" className='text-[18px] font-bold hover:underline'>Home</Link>
                    <Link to="/about" className='text-[18px] font-bold hover:underline'>About</Link>
                    <Link to="/contact" className='text-[18px] font-bold hover:underline'>Contact</Link>
                </div>
                <AccountCircleIcon sx={{ fontSize: { sm: 30, xs: 30 }, marginLeft: { sm: 58 }, display: { sm: 'flex', xs: 'none' } }} />
                <button className={`flex ml-[45%] bg-transparent p-0 cursor-pointer border-none ${toggle ? 'opened' : ''}`} onClick={() => setToggle(!toggle)} aria-expanded={toggle} aria-label="Main Menu">
                    <svg width="40" height="50" viewBox="0 0 100 100">
                        <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                        <path className="line line2" d="M 20,50 H 80" />
                        <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                    </svg>
                </button>
            </div> 
            {toggle && <div className='xs:absolute z-10 sm:hidden top-[80px] w-[300px] py-2 bg-white border rounded-md'>
                <ul className='list-none flex flex-col justify-between items-start gap-y-2 px-4'>
                    <li><a href='/home'>Home</a></li>
                    <li><a href=''>About</a></li>
                    <li><a href=''>Contact</a></li>
                </ul>
            </div>}
            <div className='relative sm:grid grid-rows-1 grid-cols-2 sm:top-[100px] xs:top-[60px] rounded-xl slider border border-black cursor-pointer' onClick={() => navigate("/exercise")}>
                <div className='border-none border-green-400 text-left sm:pl-4 sm:py-4 xs:pl-4 xs:pr-10 xs:py-2'>
                    <h1 className='sm:text-[35px] xs:text-[20px] text-white font-bold pb-4'>Check out Exercises</h1>
                    <p className='sm:w-[500px] xs:w-[190px] text-white sm:text-[20px] xs:text-[16px] pb-2'>Browse exercises according to their names, target muscles and equipments.</p>
                </div>
                <div className='xs:hidden sm:grid grid-cols-3 border-none border-purple-500'>
                    <img src={pic} className='h-[210px] object-cover border-[1.5px] border-black' />
                    <img src={pic1} className='h-[210px] object-cover border-[1.5px] border-black ' />
                    <img src={pic2} className='h-[210px] object-cover border-[1.5px] rounded-r-xl border-black ' />
                </div>
            </div>
        </>
    )
}

export default Startup1
