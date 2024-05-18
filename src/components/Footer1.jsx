import React from 'react'
import toast from 'react-hot-toast';

const Footer1 = ({ space_above }) => {
  return (
    <div style={{ top: space_above }} className='fixed items-center left-0 flex w-full h-[50px] bg-purple-500'>
        <h1 className='font-bold mx-auto text-[19px]'>Made with ❤️ by <span className='font-bold italic underline cursor-pointer' onClick={() => toast.error("Test Toaster")}>Sohel Khan</span></h1>
    </div>
  )
}

export default Footer1
