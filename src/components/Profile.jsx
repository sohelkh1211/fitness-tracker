import { user_profiles } from ".";
import { useState, useContext } from "react";
import { GlobalContext } from "./Provider";
// Importing profile icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Calendar component MUI components import 
import { InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Profile = () => {
  const { profile, setProfile } = useContext(GlobalContext);
  // console.log("Profile component :- ",profile);
  let currentDate = new Date().toDateString();
  const [value, setValue] = useState(dayjs(currentDate));
  currentDate = currentDate.slice(4, currentDate.length);

  const formatDate = (date) => {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  return (
    <>
      <div className='absolute flex flex-col top-0 left-0 lg:w-[200px] lg:h-screen bg-gradient-to-tr from-[#AD1DEB] to-[#6E72FC] border border-[#AD1DEB]'>
        <div className='mt-4 mb-12 mx-auto border border-none'>
          <h1 className='text-[23px] text-white'><span className='font-bold'>Health</span>ify</h1>
        </div>
        {user_profiles.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-3 w-fit ml-10 mb-6 cursor-pointer border border-none">
            {item.name === "Profile" ? <FontAwesomeIcon className={`mt-1 w-5 -ml-0.8 text-white ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} icon={faUser} /> : item.name === "Dashboard" ? <DashboardIcon sx={{ width: 18, height: 25, color: 'white' }} className={`${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Exercise" ? <FitnessCenterIcon sx={{ width: 19, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Logout" ? <LogoutIcon sx={{ width: 18, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : ''}
            <p className={`text-white ${profile === item.name ? 'font-bold' : ''}`} onClick={() => setProfile(item.name)}>{item.name}</p>
          </div>
        ))}
      </div>
      {profile === "Dashboard" && <div className="absolute top-0 ml-[167px] lg:w-[850px] lg:h-screen border border-l-0 border-y-0 border-[#CBD5E1]">
        <div className="absolute mt-4 ml-8 border border-none">
          <h1 className="text-[23px] dashboard"><span className="font-bold dashboard">Dash</span>board</h1>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <div className="absolute flex flex-row right-0 mt-4 mr-10 cursor-pointer border border-none" >
            <DatePicker
              label=""
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format={formatDate(value)}
              sx={{
                '& .MuiInputBase-input': {
                  width: '100px', 
                  height: '10px', 
                  paddingY: '12px',
                },
              }}
            />
          </div>
        </LocalizationProvider>
        {/* <div className="absolute flex flex-row right-0 mt-4 mr-10 py-0.5 px-2 gap-x-1 cursor-pointer border">
          <CalendarMonthIcon sx={{ width: 20, height: 16, marginTop: '3px' }} />
          <p className="date text-[16px]">{currentDate}</p>
          <ArrowDropDownIcon sx={{ width: '18px' }} />
        </div> */}
      </div>}
    </>
  )
}

export default Profile;
