import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
// ******************** Firebase ***********************
import { db, auth } from '../firebase';
import { ref as dbRef, update as dbUpdate } from 'firebase/database';
import { GlobalContext } from '../context/Provider';

const UserProfile = ({ data, setData }) => {
    const [change, setChange] = useState(false); // To enable or disaable form inputs.
    const [localData, setLocalData] = useState(data); // Needed to reflect changes made only to profile but not to dashboard simultaneously.
    const { profile } = useContext(GlobalContext);

    let currentDate = new Date().toDateString();
    currentDate = dayjs(currentDate).format("DD-MM-YYYY");

    // console.log("Local: ",localData);

    const trackerChange = (e) => {
        const { name, value } = e.target;
        if (name === "sleep") {
            setLocalData(localData => ({
                ...localData,
                sleep: {
                    ...localData.sleep,
                    [currentDate]: value // if using variable as key then we need to define it inside [] braces.
                }
            }));
        }
        if (name === 'water_intake') {
            setLocalData(localData => ({
                ...localData,
                water_intake: {
                    ...localData.water_intake,
                    [currentDate]: value // if using variable as key then we need to define it inside [] braces.
                }
            }));
        }
        if (name === "steps") {
            setLocalData(localData => ({
                ...localData,
                steps: {
                    ...localData.steps,
                    [currentDate]: value
                }
            }));
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalData({
            ...localData,
            [name]: value
        })
    }

    const getMosRecentDate = (dataObject) => {
        // converts ["12-06-2024", "13-06-2024"] to ["2024-06-12","2024-06-13"] then [Wed Jun 12 2024, Thu Jun 13 2024]
        const dates = Object.keys(dataObject).map(date => new Date(date.split("-").reverse().join("-")));
        // Sorts date in descending order [Thu Jun 13 2024, Wed Jun 12 2024]
        dates.sort((a, b) => b - a);
        // Thu Jun 13 2024
        const mostRecentDate = dates[0];
        // Converts date back to original format "13-06-2024"
        const formattedDate = `${String(mostRecentDate.getDate()).padStart(2, '0')}-${String(mostRecentDate.getMonth() + 1).padStart(2, '0')}-${String(mostRecentDate.getFullYear())}`;
        return formattedDate;
    }

    useEffect(() => {
        const updateSleepHours = () => {
            const mostRecentDate = getMosRecentDate(localData.sleep);
            if (currentDate !== mostRecentDate) {
                setLocalData({
                    ...localData,
                    sleep: {
                        ...localData.sleep,
                        [currentDate]: ''
                    }
                })
                setData(localData);
            }
        }

        const updateDatabse = async () => {
            const userRef = dbRef(db, `UserData/${auth.currentUser.uid}`);
            updateSleepHours();
            await dbUpdate(userRef, localData);
        }

        updateDatabse();

    }, []);

    useEffect(() => {
        const updateWaterIntake = () => {
            const mostRecentDate = getMosRecentDate(localData.water_intake);
            if (currentDate !== mostRecentDate) {
                setLocalData({
                    ...localData,
                    water_intake: {
                        ...localData.water_intake,
                        [currentDate]: 1
                    }
                })
                setData(localData);
            }
        }

        const updateDatabse = async () => {
            const userRef = dbRef(db, `UserData/${auth.currentUser.uid}`);
            updateWaterIntake();
            await dbUpdate(userRef, localData);
        }

        updateDatabse();

    }, []);

    useEffect(() => {
        const updateSteps = () => {
            const mostRecentDate = getMosRecentDate(localData.steps);
            if ( mostRecentDate !== currentDate ) {
                setLocalData({
                    ...localData,
                    steps: {
                        ...localData.steps,
                        [currentDate]: 1
                    }
                })
                setData(localData);
            }
        }

        const updateDatabse = async () => {
            const userRef = dbRef(db, `UserData/${auth.currentUser.uid}`);
            updateSteps();
            await dbUpdate(userRef, localData);
        }

        updateDatabse();

    }, []);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localData.first_name === '' || localData.last_name === '' || localData.height === '' || localData.dob === '') {
            toast.error("Enter all basic details");
        }
        else {
            toast.success("Profile updates successfully");
            if (data.dob !== localData.dob) { // If DOB get changed. To calculate age.
                const dob1 = new Date(localData.dob);
                const month_diff = Date.now() - dob1.getTime();
                const age_dt = new Date(month_diff);   //convert the calculated difference in date format
                const year = age_dt.getUTCFullYear();  //extract year from date
                const age = Math.abs(year - 1970);  //now calculate the age of the user
                localData.age = age;
            }
            setData(localData);
            const userRef = dbRef(db, `UserData/${auth.currentUser.uid}`);
            dbUpdate(userRef, localData);
            setChange(false);
        }
    }


    return (
        <div className="absolute top-0 lg:ml-[14%] md:ml-[15%] sm:ml-[15%] lg:w-[67%] md:w-[64%] sm:w-[57%] h-[890px] border border-l-0 border-y-0 border-[#CBD5E1]">
            <div className="absolute space-x-2 flex mt-[18px] md:ml-[40px] sm:ml-[5%]">
                <h1 className="text-[25px] dashboard">My Profile</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="absolute flex mt-[80px] lg:ml-[3%] md:ml-[3%] sm:ml-[3%] pt-3 pb-6 lg:w-[93%] md:w-[90%] sm:w-[90%] h-[400px] rounded-md border border-gray-400">
                    <div className="absolute flex flex-col gap-y-1 sm:ml-[2%] mt-[7px]">
                        <p className="text-left">First Name</p>
                        <input disabled={!change} type="text" name="first_name" placeholder="First Name" defaultValue={localData.first_name} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 px-2 py-0.5 lg:w-auto md:w-[90%] sm:w-[50%] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 md:ml-[55%] sm:ml-[60%] mt-[7px]">
                        <p className="text-left">Last Name</p>
                        <input disabled={!change} type="text" name="last_name" placeholder="Last Name" defaultValue={localData.last_name} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 px-2 py-0.5 lg:w-auto md:w-[90%] sm:w-[70%] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 sm:ml-[2%] mt-[77px]">
                        <p className="text-left">Height</p>
                        <input disabled={!change} type="number" name="height" placeholder="Height" defaultValue={localData.height} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 px-2 py-0.5 lg:w-auto md:w-[90%] sm:w-[50%] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 md:ml-[55%] sm:ml-[60%] mt-[77px]">
                        <p className="text-left">Weight (Kg)</p>
                        <input disabled={!change} type="number" name="weight" placeholder="Weight in Kg" defaultValue={localData.weight} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 px-2 py-0.5 lg:w-auto md:w-[90%] sm:w-[70%] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 sm:ml-[2%] mt-[142px]">
                        <p className="text-left">Birthday</p>
                        <input disabled={!change} type="date" name="dob" placeholder="Birthday" defaultValue={localData.dob} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:w-[170%] md:w-[152%] sm:w-[85%] px-2 py-0.5 rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 md:ml-[55%] sm:ml-[60%] mt-[144px]">
                        <p className="text-left">Email</p>
                        <input disabled={!change} type="email" name="email" placeholder="Email" defaultValue={localData.email} onChange={handleInputChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:w-auto md:w-[91%] sm:w-[72%] px-2 py-0.5 rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-1 sm:ml-[2%] mt-[215px]">
                        <p className="text-left">Sleep Hours</p>
                        <input disabled={!change} type="time" name="sleep" placeholder="Sleep hours" value={localData.sleep[currentDate] || ''} onChange={trackerChange} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 px-2 py-0.5 lg:w-[285%] md:w-[255%] sm:w-[145%] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute flex flex-col gap-y-0.4 md:ml-[55%] sm:ml-[60%] mt-[215px]">
                        <p className="text-left">Water Intake Limit</p>
                        <InputNumber disabled={!change} name='water_intake' onValueChange={trackerChange} value={localData.water_intake[currentDate] || ''} mode="decimal" showButtons min={1} max={15} />
                    </div>
                    <div className="absolute flex flex-col gap-y-0.4 sm:ml-[2%] mt-[290px]">
                        <p className="text-left">Steps count</p>
                        <InputNumber disabled={!change} name='steps' onValueChange={trackerChange} value={localData.steps[currentDate] || ''} mode="decimal" showButtons />
                    </div>
                </div>
                {change &&
                    <button type='submit' className='absolute flex text-green-400 md:px-2 md:py-1 sm:px-1 sm:py-1 top-[500px] lg:ml-[55%] md:ml-[55%] sm:ml-[52%] hover:shadow-lg rounded-md border border-green-500 cursor-pointer'>Save Changes</button>
                }
            </form>
            {change && <button onClick={() => setChange(false)} className='absolute flex text-black-100 md:px-4 md:py-1 sm:px-3 sm:py-1 top-[500px] lg:ml-[40%] md:ml-[30%] sm:ml-[25%] hover:shadow-lg rounded-md border border-gray-300 cursor-pointer'>Cancel</button>}
            {!change && <button onClick={() => setChange(true)} className="absolute flex text-black-100 md:text-[16px] sm:text-[14px] md:px-2 sm:py-1 sm:px-1  top-[500px] lg:ml-[45%] md:ml-[40%] sm:ml-[37%] hover:shadow-lg bg-green-300 rounded-md border border-green-300 cursor-pointer">Edit Changes</button>}
        </div>
    )
}

export default UserProfile;
