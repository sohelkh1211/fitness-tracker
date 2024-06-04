import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../context/Provider';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import pic from '../assets/pullup.jpg';
import pic1 from '../assets/deadlift.jpg';
import pic2 from '../assets/pushup.jpg';
import calories from '../assets/calories.png';
import sleep from '../assets/sleep_tracker1.avif';
import Hydration from '../assets/Hydration.jpg';
import { useNavigate } from 'react-router-dom';

const Startup1 = () => {
    const [toggle, setToggle] = useState(false); // For mobile xs devices
    const [isscroll, setIsscroll] = useState(false); // To style navbar bottom border green -> on scroll 

    const { data } = useContext(GlobalContext);
    console.log(data.image);
    useEffect(() =>{
        const handleScroll = () => {
            if(window.scrollY > 200){
                setIsscroll(true);
            }
            else{
                setIsscroll(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);
    const navigate = useNavigate();
    return (
        <>
            <div className={`fixed flex top-0 z-20 w-full left-0 h-[60px] bg-white rounded-md ${isscroll ? ' border-b-green-600 border-b-2' : ''} border justify-start items-center`}>
                <p className='px-[30px] py-[14px] text-[18px] font-semibold'>Healthify</p>
                <div className='sm:flex xs:hidden justify-between gap-8 ml-[32%] border-none border-black'>
                    <Link to="/home" className='text-[18px] font-bold hover:underline'>Home</Link>
                    <Link to="/about" className='text-[18px] font-bold hover:underline'>About</Link>
                    <Link to="/contact" className='text-[18px] font-bold hover:underline'>Contact</Link>
                </div>
                {data.image ? <img src={data.image} className='ml-[450px] w-[36px] cursor-pointer border-[1.5px] border-stone-500 rounded-full object-cover' onClick={() => navigate("/user/profile")} /> : <AccountCircleIcon sx={{ fontSize: { sm: 30, xs: 30 }, marginLeft: { sm: 58 }, display: { sm: 'flex', xs: 'none' }, cursor: 'pointer' }} onClick={() => navigate("/user/profile")} />}
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
            <div className='relative grid sm:grid-cols-2 xs:grid-cols-1 sm:top-[140px] xs:top-[90px] rounded-xl slider cursor-pointer border border-black-100'>
                <div className='border-none border-green-400 text-left sm:pl-4 sm:py-4 xs:pl-4 xs:pr-10 xs:py-2'>
                    <h1 className='sm:text-[35px] xs:text-[20px] text-white font-bold pb-4'>Track your calories</h1>
                    <p className='sm:w-[500px] xs:w-[170px] sm:text-[20px] xs:text-[16px] text-white'>Track How many calories you have burnt and gained today.</p>
                </div>
                <div className='xs:hidden sm:flex border-none border-fuchsia-500'>
                    <img src={calories} className='mt-4 mx-auto w-[50%] h-[80%] object-cover rounded-xl border-black border-[2px]' />
                </div>
            </div>
            <div className='relative grid sm:grid-cols-2 xs:grid-cols-1 sm:top-[160px] xs:top-[120px] rounded-xl slider cursor-pointer border border-black-100'>
                <div className='border-none border-green-400 text-left sm:pl-4 sm:py-4 xs:pl-4 xs:pr-10 xs:py-2'>
                    <h1 className='sm:text-[35px] xs:text-[20px] text-white font-bold pb-4'>Track sleep hours</h1>
                    <p className='sm:w-[500px] xs:w-[170px] sm:text-[20px] xs:text-[16px] text-white'>Optimize your rest: Track your sleep hours for better health.</p>
                </div>
                <div className='xs:hidden sm:flex overflow-hidden border-none border-orange-500'>
                    <img src={sleep} className='my-auto mx-auto w-[50%] h-[80%] rounded-xl object-cover' />
                </div>
            </div>
            <div className='relative grid sm:grid-cols-2 xs:grid-cols-1 sm:top-[180px] xs:top-[140px] rounded-xl slider cursor-pointer mb-8 border border-black-100'>
                <div className='text-left sm:pl-4 sm:py-4 xs:pl-4 xs:pr-10 xs:py-2'>
                    <h1 className='sm:text-[35px] xs:text-[20px] text-white font-bold pb-4'>Track your hydration</h1>
                    <p className='sm:w-[500px] xs:w-[170px] sm:text-[20px] xs:text-[16px] text-white'>Stay refreshed and hydrated: Track your water intake.</p>
                </div>
                <div className='xs:hidden sm:flex pt-8 pb-4 border-none border-yellow-500'>
                    <img src={Hydration} className='mx-auto w-[50%] h-[90%] rounded-xl object-cover' />
                </div>
            </div>
            <div className='relative top-[200px] border'></div>
        </>
    )
}

export default Startup1
