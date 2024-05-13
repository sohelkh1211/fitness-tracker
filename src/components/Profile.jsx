import { user_profiles } from ".";
import { dashboard_card } from ".";
import { useState, useContext } from "react";
import { GlobalContext } from "./Provider";
// Importing profile icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
// Calendar component MUI components import 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Importing pics
import dashboard_fitness from '../assets/Dashboard_fitness.png';
import heart from '../assets/heart-rate.png';
import fire from '../assets/fire.png';
import sleep from '../assets/sleeping.png';

const Profile = () => {
  const { profile, setProfile } = useContext(GlobalContext);
  // console.log("Profile component :- ",profile);

  let currentDate = new Date().toDateString();
  const [value, setValue] = useState(dayjs(currentDate));

  // To formate date as :- MonthName DD, YYYY. E.g :- May 09, 2024
  const formatDate = (date) => {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <>
      {/* For the side bar */}
      <div className='absolute flex flex-col top-0 left-0 lg:w-[200px] lg:h-screen bg-gradient-to-tr from-[#AD1DEB] to-[#6E72FC] border border-[#AD1DEB]'>
        <div className='mt-4 mb-12 mx-auto border border-none'> {/* For Healthify title.*/}
          <h1 className='text-[23px] text-white'><span className='font-bold'>Health</span>ify</h1>
        </div>
        {/* For displaying each profile such as dashboard, profile etc. */}
        {user_profiles.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-3 w-fit ml-10 mb-6 cursor-pointer border border-none">
            {item.name === "Profile" ? <FontAwesomeIcon className={`mt-1 w-5 -ml-0.8 text-white ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} icon={faUser} /> : item.name === "Dashboard" ? <DashboardIcon sx={{ width: 18, height: 25, color: 'white' }} className={`${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Exercise" ? <FitnessCenterIcon sx={{ width: 19, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Logout" ? <LogoutIcon sx={{ width: 18, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : ''}
            <p className={`text-white ${profile === item.name ? 'font-bold' : ''}`} onClick={() => setProfile(item.name)}>{item.name}</p>
          </div>
        ))}
      </div>
      {/* When profile value is Dashboard */}
      {profile === "Dashboard" && <div className="absolute top-0 ml-[167px] lg:w-[850px] lg:h-screen border border-l-0 border-y-0 border-[#CBD5E1]">
        <div className="absolute mt-4 ml-8 border border-none">
          <h1 className="text-[23px] dashboard"><span className="font-bold dashboard">Dash</span>board</h1>
        </div>
        {/* MUI DatePicker component part */}
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <div className="absolute flex flex-row right-0 mt-4 lg:mr-10 cursor-pointer border border-none" >
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
        {/* Welcome to Fitness! part */}
        <div className="absolute flex mt-20 lg:ml-8 lg:w-[780px] lg:p-4 rounded-xl border">
          <img src={dashboard_fitness} className="lg:w-[370px] lg:h-[190px] rounded-xl" />
          <div className="flex flex-col"> {/* To display both p elements in column instead in row */}
            <p className="lg:ml-5 lg:mt-14 lg:text-[28px] font-bold">Welcome to Fitness!</p>
            <p className="lg:ml-8 lg:mt-2"> Start Today, Feel Stronger Tomorrow.</p>
          </div>
        </div>
        <div className="absolute flex flex-row mt-[330px] lg:ml-8 justify-between gap-x-8 rounded-xl border-none">
          {dashboard_card.map((card, index) => (
            <div key={index} className={`${card.name === "Calories Burnt" ? 'w-[200px]' : 'w-[170px]'} p-2 rounded-lg border border-black`}>
              <div className="flex flex-row justify-between gap-x-6">
                <p className="text-left dashboard font-bold">{card.name}</p>
                <img src={`${ card.name === "Heart Rate" ? heart : card.name === "Calories Burnt" ? fire : sleep}`} className="w-[40px]" />
              </div>
              <p className="text-left mt-8 dashboard">--- {card.measure}</p>
            </div>
          ))}
        </div>
      </div>}
    </>
  )
}

export default Profile;
