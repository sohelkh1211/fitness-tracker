import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UserProfile = ({ data, setData }) => {
    const [change, setChange] = useState(false);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }
    console.log("User Profile: ", data);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.first_name === '' || data.last_name === '' || data.height === '' || data.dob === '') {
            toast.error("Enter all details");
        }
        else {
            setChange(false);
        }

    }


    return (
        <div className="absolute top-0 ml-[167px] lg:w-[850px] lg:h-[890px] border border-l-0 border-y-0 border-[#CBD5E1]">
            <div className="absolute space-x-2 flex mt-[18px] ml-[40px]">
                <h1 className="text-[25px] dashboard">My Profile</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="absolute flex lg:mt-[80px] lg:ml-[42px] lg:pt-3 lg:pb-6 lg:w-[766px] lg:h-[330px] rounded-md border border-gray-400">
                    <div className="">
                        <p className="text-left lg:ml-4">First Name</p>
                        <input disabled={!change} type="text" name="first_name" placeholder="First Name" defaultValue={data.first_name} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:ml-4 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="">
                        <p className="text-left lg:ml-28">Last Name</p>
                        <input disabled={!change} type="text" name="last_name" placeholder="Last Name" defaultValue={data.last_name} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:ml-28 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-20 lg:ml-4">
                        <p className="text-left">Height</p>
                        <input disabled={!change} type="number" name="height" placeholder="Height" defaultValue={data.height} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-20 lg:ml-[428px]">
                        <p className="text-left">Weight</p>
                        <input disabled={!change} type="number" name="weight" placeholder="Weight" defaultValue={data.weight} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-[160px] lg:ml-4">
                        <p className="text-left">Birthday</p>
                        <input disabled={!change} type="date" name="dob" placeholder="Birthday" defaultValue={data.dob} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-[160px] lg:ml-[428px]">
                        <p className="text-left">Email</p>
                        <input disabled={!change} type="email" name="email" placeholder="Email" defaultValue={data.email} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-[240px] lg:ml-4">
                        <p className="text-left">Sleep Hours</p>
                        <input disabled={!change} type="time" name="sleep" placeholder="Sleep hours" defaultValue={""} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-[240px] lg:ml-[428px]">
                        <p className="text-left">Water Intake Limit</p>
                        <input disabled={!change} type="number" name="water_intake" placeholder="Intake limit" defaultValue={1} value={data.water} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                </div>
                {change &&
                    <button type='submit' className='absolute flex text-green-400 lg:px-2 lg:py-1 lg:top-[430px] lg:ml-[460px] hover:shadow-lg rounded-md border border-green-500 cursor-pointer'>Save Changes</button>
                }
            </form>
            {change && <button onClick={() => setChange(false)} className='absolute flex text-black-100 lg:px-4 lg:py-1 lg:top-[430px] lg:ml-[340px] hover:shadow-lg rounded-md border border-gray-300 cursor-pointer'>Cancel</button>}
            {!change && <button onClick={() => setChange(true)} className="absolute flex text-black-100 lg:px-2 lg:py-1 lg:top-[430px] lg:ml-[380px] hover:shadow-lg bg-green-300 rounded-md border border-green-300 cursor-pointer">Edit Changes</button>}
        </div>
    )
}

export default UserProfile;
