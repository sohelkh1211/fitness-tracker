import { user_profiles } from ".";
import { dashboard_card } from ".";
import { tracker_graph } from ".";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/Provider";
import { toast } from 'react-hot-toast';
// Importing profile icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Calendar component MUI components import 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import Dialog from '@mui/material/Dialog';
// Importing pics
import dashboard_fitness from '../assets/Dashboard_fitness.png';
import heart from '../assets/heart-rate.png';
import fire from '../assets/fire.png';
import sleep from '../assets/sleeping.png';
import user from '../assets/user.png';
// Prime react components
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import Avatar from 'react-avatar-edit';

const Profile = () => {
  const navigate = useNavigate();
  const { profile, setProfile, setUser } = useContext(GlobalContext);
  // console.log("Profile component :- ",profile);

  let currentDate = new Date().toDateString();
  const [value, setValue] = useState(dayjs(currentDate));

  const [date, setDate] = useState("Day"); {/* For displaying Weekly, Monthly graph */ }
  const [open, setOpen] = useState(false); {/* For selecting trackers */ }
  const [option, setOption] = useState("Heart Rate");

  // For user profile image
  const [imagecrop, setImagecrop] = useState(false);
  const [src, setSrc] = useState(false);
  const [prof, setProf] = useState([]);
  const [preview, setPreview] = useState();

  const profileFinal = prof.map((item) => item.preview);
  console.log(profileFinal);

  // To formate date as :- MonthName DD, YYYY. E.g :- May 09, 2024
  const formatDate = (date) => {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const onClose = () => {
    setPreview(null);
  }

  const onCrop = (view) => {
    setPreview(view);
  }

  const savecropImage = () => {
    setProf([...prof, { preview }]);
    setImagecrop(false);
  }

  return (
    <>
      {/* For the side bar */}
      <div className='absolute flex flex-col top-0 left-0 lg:w-[200px] lg:h-[162%] bg-gradient-to-tr from-[#AD1DEB] to-[#6E72FC] border border-[#AD1DEB]'>
        <div className='mt-4 mb-12 mx-auto border border-none'> {/* For Healthify title.*/}
          <h1 className='text-[23px] text-white'><span className='font-bold'>Health</span>ify</h1>
        </div>
        {/* For displaying each profile such as dashboard, profile etc. */}
        {user_profiles.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-3 w-fit ml-10 mb-6 cursor-pointer border border-none">
            {item.name === "Profile" ? <FontAwesomeIcon className={`mt-1 w-5 -ml-0.8 text-white ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} icon={faUser} /> : item.name === "Dashboard" ? <DashboardIcon sx={{ width: 18, height: 25, color: 'white' }} className={`${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Exercise" ? <FitnessCenterIcon sx={{ width: 19, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Logout" ? <LogoutIcon sx={{ width: 18, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : ''}
            <p className={`text-white ${profile === item.name ? 'font-bold' : ''}`} onClick={() => {
              setProfile(item.name);
              if (item.name === "Logout") {
                setUser(null);
                toast.success("Logged Out Successfully");
                navigate("/");
              }
            }}>{item.name}</p>
          </div>
        ))}
      </div>

      {/* For right side bar */}
      <div className="absolute flex flex-col top-14 ml-[1070px] border-none">
        <img src={profileFinal.length ? profileFinal : user} className="w-[100px] cursor-pointer mx-auto"
          onClick={() => setImagecrop(true)} alt="" />
        <p className="mt-2 font-bold text-[17px]">Mohammed Sohel</p>
        <Dialog
          visible={imagecrop}
          className=" bg-purple-50 rounded-lg"
          onHide={() => setImagecrop(false)}
        >
          <div className="flex flex-col items-center">
            <Avatar
              width={350}
              height={200}
              onCrop={onCrop}
              onClose={onClose}
              src={src}
              shadingColor={"#474649"}
              backgroundColor={"#474649"}
            />
            <div className="flex mt-2 mb-2 mx-auto">
              <Button
                onClick={savecropImage}
                className="cursor-pointer space-x-2 px-2 py-1 font-bold bg-white text-purple-400 hover:border-purple-400 hover:border-[1.5px] rounded-md shadow-lg border"
                label="Save"
                icon="pi pi-check"
                severity="success" text raised
              />
            </div>
          </div>
        </Dialog>
      </div>

      {/* When profile value is Dashboard */}
      {profile === "Dashboard" && <div className="absolute top-0 ml-[167px] lg:w-[850px] border border-l-0 border-y-0 border-[#CBD5E1]">
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
        {/* Trackers section */}
        {/* #A1C4FD -> #C2E9FB , br #91A6FF -> #FFFFFF */}
        {/*Heart rate :- bg-gradient-to-bl from-[#ff4f4f] to-[#ffb2b2]
        Calories burnt :- bg-gradient-to-tl from-[#FFFF00] to-[#ff5151]
        Sleep :- bg-gradient-to-l from-[#A1C4FD] to-[#C2E9FB]*/}
        {/* tr #D3D3D3 -> #FF6B6B, #FF7878 -> #FFFFFF */}
        <div className="absolute flex flex-row mt-[330px] lg:ml-8 justify-between gap-x-8 rounded-xl border-none">
          {dashboard_card.map((card, index) => (
            <div key={index} className={`${card.name === "Calories Burnt" ? 'w-[200px]' : 'w-[170px]'} hover:scale-105 cursor-pointer p-2 rounded-lg ${card.name === "Sleep" ? 'bg-sleep bg-cover' : card.name === "Heart Rate" ? 'bg-heart bg-cover' : 'bg-calories bg-cover'}  border border-black`}>
              <div className="flex flex-row justify-between gap-x-6">
                <p className={`text-left dashboard font-bold`}>{card.name}</p>
                <img src={`${card.name === "Heart Rate" ? heart : card.name === "Calories Burnt" ? fire : sleep}`} className="w-[40px]" />
              </div>
              <p className="text-left mt-8 dashboard ">--- {card.measure}</p>
            </div>
          ))}
        </div>
        {/* User's trackers graph section */}
        <div className="absolute flex mt-[470px] lg:ml-8 pb-4 lg:w-[780px] lg:h-[380px] rounded-md border">
          <div className="mt-2 ml-[350px] justify-between space-x-3">
            {tracker_graph.map((tracker, index) => (
              <button key={index} className={`dashboard text-[14px] font-bold ${date === tracker.name ? 'bg-purple-600' : 'bg-purple-100'} border py-0.5 px-5`} onClick={() => setDate(tracker.name)}>{tracker.name}</button>
            ))}
            <MoreVertIcon className="cursor-pointer" onClick={() => setOpen(!open)} />
          </div>
          {/* For option teacker selection like Heart Rate*/}
          {open && <div className="absolute mt-10 ml-[620px] w-[120px] px-3 py-1 flex flex-col bg-white z-20 items-start space-y-1 rounded-md border">
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Heart Rate");
              setOpen(!open);
            }}>Heart Rate</p>
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Calories Burnt");
              setOpen(!open);
            }}>Calories Burnt</p>
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Sleep");
              setOpen(!open);
            }}>Sleep</p>
          </div>}
          <div className="absolute flex items-center mt-12 lg:ml-5 w-[740px] h-[300px] rounded-xl border border-black">
            <p className="mx-auto text-[35px]">No Data Available</p>
          </div>
        </div>
        <div className="flex mt-[890px] border-none"></div>
      </div>}
    </>
  )
}

export default Profile;