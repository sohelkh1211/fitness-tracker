import { user_profiles } from ".";
import { dashboard_card } from ".";
import { tracker_graph } from ".";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Provider, { GlobalContext } from "../context/Provider";
import { toast } from 'react-hot-toast';
import EventForm from "./EventForm";
import UserProfile from "./UserProfile";
// Importing profile icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
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
import user from '../assets/user.png';
// Prime react components
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import Avatar from 'react-avatar-edit'; {/* To upload and crop the image. */ }
// Chart imports
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
// Sending user image to firebase
import { v4 as uuid } from 'uuid';
import { db, storage } from "../firebase";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref as dbRef, update as databaseUpdate, get, remove } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from "firebase/storage";
import { fetchUserData } from "../utils/fetchData";


const Profile = () => {
  const navigate = useNavigate();
  const { profile, setProfile, setUser, data, setData } = useContext(GlobalContext); // profile for sidebar, usetUser for logout, data for user's data such as name, image.
  // console.log("Profile component :- ",profile);

  // **************** Dashboard top calendar **********************
  let currentDate = new Date().toDateString();
  const [value, setValue] = useState(dayjs(currentDate));

  const [period, setPeriod] = useState("Daily"); {/* For displaying Weekly, Monthly graph */ }
  const [open, setOpen] = useState(false); {/* For selecting trackers */ }
  const [option, setOption] = useState("Sleep");
  // *************************************************************

  // ******************* To view EventForm **********************
  const [eventView, setEventView] = useState(false);
  // ***********************************************************

  // **************** To formate date as :- MonthName DD, YYYY. E.g :- May 09, 2024 **************** //
  const formatDate = (date) => {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  // **************************************************************************** //

  // ****************** For Displaying User Events *******************
  const [events, setEvents] = useState([]);
  // *****************************************************************

  // ************* For user profile image ****************** //
  const [imagecrop, setImagecrop] = useState(false); {/* To display or hide dialogue box. */ }
  const [src, setSrc] = useState(false); {/* Required prop of Avatar */ }
  const [prof, setProf] = useState([]); {/* To store cropped image in the form of object i.e { preview : view } */ }
  const [preview, setPreview] = useState(); {/* Required state variable to save cropped image temporarily in preview. */ }

  // To fetch final image from prof state which is an array of object i.e prof = [ { preview: } ].
  const profileFinal = prof.map((item) => item.preview);

  // set preview to null when Avatar get closed.
  const onClose = () => {
    setPreview(null);
  }

  /* Set preview to the croped image i.e view */
  const onCrop = (view) => {
    setPreview(view);
  }

  // Store { preview : view } to the prof array. Also, set imagecrop to false because we need to close the dialogue box.
  const savecropImage = async () => {
    let updatedProf = [...prof, { preview }];
    // console.log("Updated prof :- ", updatedProf);
    // If user is uploading image second time then we need to first remove his previous image.
    // Because length of updatedProf array becomes 2 when he re-uploads image.
    if (updatedProf.length >= 2) {
      // console.log("Done");
      updatedProf.shift();
    }
    setProf(updatedProf);
    const img = updatedProf.map((item) => item.preview);
    setImagecrop(false);
    await uploadFile(img[0]);
  }

  // **************** To upload user image to Firebase ******************* //
  const uploadFile = async (base64Image) => {
    if (base64Image === undefined) {
      toast.error("Please select an image");
      return;
    }
    deleteFile(); // This function is defined at line 149 below. To delete exisiting image from firebase/storage when user re-uploads image.
    const [contentType, base64String] = base64Image.split(';base64,');
    const imageBlob = base64ToBlob(base64Image, contentType.split(':')[1]); // First convert base4Image to Blob inorder to display image.

    // Create a reference to 'images/uuid() where each uid is unique.'
    const imageRef = storageRef(storage, `images/${uuid()}`);

    uploadBytes(imageRef, imageBlob).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        toast.success("Image uploaded ✨");
        // console.log("File URL :- ", url);
        const user = auth.currentUser;
        const userRef = dbRef(db, `UserData/${user.uid}`);
        databaseUpdate(userRef, { image: url });
      }).catch((error) => {
        toast.error(error);
      })
    }).catch((error) => {
      toast.error(error);
    })
  };

  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };
  // *************************************************** //

  // ****************** To delete file or image from firebase storage when user re-uploads his/her image ***********//
  const deleteFile = async () => {
    if (data.image !== '') {
      const fileRef = storageRef(storage, data.image);
      await deleteObject(fileRef);
      // console.log("File deleted successfully");
    }

  }

  // ********************** Fetching and removing data from firebase ************************* //
  const [user_id, setUser_id] = useState(null);
  // onAuthStateChanged is required because auth changes frequently, it changes from null to the value of currentUser.
  // And we need user's unique ID to fetch his/her data from firebase.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser_id(user.uid);
      }
      else {
        setUser_id(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // For Fetching user's basic Data
    const fetchData = async (user_id) => {
      const res1 = await fetchUserData(user_id);
      setData({
        ...data,
        ...res1
      });
    }

    // For fetching user's event data
    const fetchEvent = async (user_id) => {
      const userRef = dbRef(db, `events/${user_id}`);
      const snapshot = await get(userRef);
      let event = snapshot.val();
      if (event) {
        event = Object.keys(event).map((key) => {
          return { id: key, ...event[key] };
        });
      }
      setEvents(event);
    }

    fetchData(user_id);
    fetchEvent(user_id);
  }, [user_id, data]); // Run useEffect whenever there is change in user_id { when user logs in } and data changes { user update some data }.

  // **** To dynamically update events state so that it should immediately appears on user's screen. ****
  const addEvent = (newEvent) => {
    // [...prevEvents, newEvent] uses the spread operator (...) to create a new array.
    // ...prevEvents spreads the elements of the existing events array into the new array.
    // newEvent is then added as the last element in the new array.
    setEvents(prevEvents => {
      if (!Array.isArray(prevEvents)) {
        prevEvents = [];
      }
      return [...prevEvents, newEvent];
    });
  };

  // ********* To delete event when user clicks on remove Icon button. ************
  const handleEventDelete = async (eventID) => {
    const eventRef = dbRef(db, `events/${user_id}/${eventID}`);
    await remove(eventRef);

    setEvents(events.filter(event => event.id !== eventID));
    // .filter(...): This is an array method that creates a new array with all elements that pass the test or condition implemented by the provided function.
    // event => event.id !== eventId: This is the test function provided to filter. For each event in the events array:
    // event.id: This is the ID of the current event being processed by the filter method.
    // eventId: This is the ID of the event that we want to remove from the array.
    // E.g :- Suppose, we wanna delete event 2
    // const events = [
    //   { id: '1', title: 'Event 1' },
    //   { id: '2', title: 'Event 2' },
    //   { id: '3', title: 'Event 3' }
    // ];
    // For the event with id: '1', the condition 1 !== 2 is true, so it is included in the new array.
    // For the event with id: '2', the condition 2 !== 2 is false, so it is excluded from the new array.
    // For the event with id: '3', the condition 3 !== 2 is true, so it is included in the new array.
  }
  // console.log(events);
  // console.log("Profile: ", data);
  // ************************************************************* //

  //  ***************** For displaying charts or graphs **************
  Chart.register(CategoryScale);

  const convertTimeToHours = (time) => {
    if (time === "") {
      return ""
    }
    const [hours, minutes] = time.split(":").map(Number); // Convert time string i.e "08:00" to ["08","00"] to numbers that are hours: 08 , minutes: 00
    return (hours + minutes / 60).toFixed(2);
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: option === "Sleep" ? "Sleep hours" : '',
        data: [],
        backgroundColor: "#22D3EE", // #50AF95
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  useEffect(() => {
    // Object.entries(data.sleep) returns [['14-06-2024', '07:20'], ['15-06-2024', '06:45']] Array of arrays.
    var sleepData = Object.entries(data.sleep).map(([date, time]) => ({
      date,
      hours: convertTimeToHours(time)
    })); // returns array of objects [ { date: '01-06-2024', hours: '6.50' }, { date: '02-06-2024', hours: '7.33' }, { date: '03-06-2024', hours: '7.20' }, ... ]

    if (option === "Sleep" && sleepData.length >= 7 || sleepData.length < 7 && period === "Daily") { // If we have more than 7 days of user's sleep data then we only show recent 7 days graph to user.
      let temp = sleepData.map((item) => ({
        ...item,
        date: new Date(item.date.split("-").reverse().join("-"))
      }));
      temp.sort((a, b) => a.date - b.date);
      temp = temp.map((item) => ({
        ...item,
        date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      }));
      var sleepDailyData = temp.slice(-7)
    }

    if (option === "Sleep" && sleepData.length > 7 && period === "Weekly") {
      var weekSleepData = sleepData
        .map(item => ({
          ...item,
          date: new Date(item.date.split("-").reverse().join("-"))
        }))
        .sort((a, b) => b.date - a.date); // E.g :- Look at UserProfile.jsx
      // [ {date: Mon Jun 17 2024 05:30:00 GMT+0530 (India Standard Time), hours: '6.25'},{date: Sun Jun 16 2024 05:30:00 GMT+0530 (India Standard Time), hours: '6.50'},{date: Sat Jun 15 2024 05:30:00 GMT+0530 (India Standard Time), hours: '7.00'}, ..............]
      let weekCount = 1;
      let currentWeek = []; // Stack to push current week dates. E.g :- Starting from 17-06-2024 to 11-06-2024 
      const results = {}; // Desired output that we want. results = { week1: '', week2: '', week3: '' }

      for (let i = 0; i < weekSleepData.length; i++) {
        currentWeek.push(weekSleepData[i]);
        if (currentWeek.length === 7 || i === weekSleepData.length - 1) {
          const weekKey = `week${weekCount}`;
          const totalHours = currentWeek.reduce((sum, item) => sum + parseFloat(item.hours), 0); // Calculates total sum of 7 days sleep hours
          const averageHours = totalHours / currentWeek.length;
          results[weekKey] = averageHours.toFixed(2);
          weekCount++;
          currentWeek = [];
        }
      }

      // results = { week1: '7.12', week2: '7.36', week3: '7.01' } // ordered from most recent to oldest.

      // Keep only the most recent 4 weeks.
      const recentWeeks = Object.keys(results).slice(-4);
      // To rename weeks in the order from oldest to most recent [ means oldest: n to most recent: 0]
      const finalResults = {};

      recentWeeks.forEach((week, index) => { // rename keys :- finalResults = { week3: '7.12', week2: '7.36', week1: '7.01' }
        finalResults[`week${recentWeeks.length - index}`] = results[week];
      });

      var finalWalaResult = {};
      // Now reverse object :- finalWalaResults = { week1: '7.01', week2: '7.36', week3: '7.12' }
      const finalRecentWeeks = Object.keys(finalResults).reverse(); // [ week1, week2, week3 ]
      finalRecentWeeks.forEach((week, index) => {
        finalWalaResult[week] = finalResults[week];
      });
    }

    if (option === "Sleep" && period === "Monthly") {
      let temp = sleepData.map((item) => ({
        ...item,
        date: new Date(item.date.split("-").reverse().join("-"))
      }));
      temp.sort((a, b) => a.date - b.date);
      temp = temp.slice(-123);
      // console.log(temp);
      var monthNames = [(temp[0].date).toLocaleString('default', { month: 'long' })];
      var currentMonthHours = [];
      var results = [];

      for (let i = 0; i < temp.length; i++) {
        if (monthNames.slice(-1) == (temp[i].date).toLocaleString('default', { month: 'long' }) && i !== temp.length - 1) {
          currentMonthHours.push(temp[i].hours);
        }
        else {
          if (i !== temp.length - 1) {
            monthNames.push((temp[i].date).toLocaleString('default', { month: 'long' }));
          }
          else {
            currentMonthHours.push(temp[i].hours);
          }
          const totalMonthHours = currentMonthHours.reduce((sum, item) => sum + parseFloat(item), 0);
          const avgMonthHours = totalMonthHours / currentMonthHours.length;
          results.push(avgMonthHours.toFixed(2));
          currentMonthHours = [temp[i].hours];
        }
      }
      // console.log(monthNames);
      // console.log(results);
    }

    setChartData({
      labels: option === "Sleep" && period === "Daily" ? sleepDailyData.map(item => item.date) : option === "Sleep" && period === "Weekly" ? Object.keys(finalWalaResult) : option === "Sleep" && period === "Monthly" ? monthNames : [],
      datasets: [
        {
          ...chartData.datasets[0],
          data: option === "Sleep" && period === "Daily" ? sleepDailyData.map(item => item.hours) : option === "Sleep" && period === "Weekly" ? Object.values(finalWalaResult) : option === "Sleep" && period === "Monthly" ? results : [],
        }
      ]
    });

  }, [data, user_id, option]); // useEffect Runs whenever there is change in data, user_id [ when user logs in ] and changes options i.e to sleep, water_intake etc.

  // *****************************************************************


  return (
    <>
      {/* ************ For the side bar *************** */}
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
      {/* ********************************************** */}

      {/* *************** For right side bar ****************** */}
      {/* User's Image upload */}
      <div className="absolute flex flex-col top-14 ml-[1080px] border-none">
        <img src={data.image ? data.image : user} className="w-[100px] cursor-pointer mx-auto brightness-50"
          onClick={() => setImagecrop(true)} alt="" />
        <p className="mt-2 font-bold text-[17px]">{data.first_name} {data.last_name}</p>
        <Dialog
          visible={imagecrop}
          className="bg-purple-50 rounded-lg"
          onHide={() => setImagecrop(false)}
          header={() => (
            <p className="font-bold ">Upload Image</p>
          )}
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
        <a className="lg:text-[13px] lg:mt-2 cursor-pointer text-cyan-600" onClick={() => setProfile("Profile")}>Edit health details</a>
      </div>

      {/* Displaying user's weight, height and age */}
      <div className="absolute flex flex-row lg:px-3 lg:py-2 lg:top-[240px] lg:ml-[1050px] justify-between lg:gap-x-2 bg-[#f4faff] rounded-md border">
        <div>
          <p className="lg:text-[14px] font-bold">Weight</p>
          <p className="lg:text-[14px]">{data.weight ? data.weight : '---'}</p>
        </div>
        <div>
          <p className="lg:text-[14px] font-bold">Height</p>
          <p className="lg:text-[14px]">{data.height * 30.48} cm</p>
        </div>
        <div>
          <p className="lg:text-[14px] font-bold">Age</p>
          <p className="lg:text-[14px]">{data.age}</p>
        </div>
      </div>

      {/* Schedule Part */}
      <div className="absolute flex flex-row lg:space-x-[15px] lg:top-[325px] lg:ml-[1030px] border border-none">
        <p className="font-bold dashboard_schedule">Scheduled</p>
        <AddCircleIcon className="left-0 cursor-pointer border border-none text-black" sx={{ width: '20px', height: 'px' }} onClick={() => setEventView(true)} />
        {eventView && <EventForm addEvent={addEvent} view={eventView} setView={setEventView} />}
      </div>
      <div className="absolute flex flex-col lg:top-[360px] lg:ml-[1035px] justify-between gap-y-2">
        {/* Apply map function to show all scheduled task from firebase */}
        {events && events.map((ele) => (
          <div key={ele.id} className="flex flex-col lg:px-2.5 lg:py-1 rounded-md border border-black">
            <div className="flex flex-row border w-[170px] justify-between border-none">
              <p className="text-[14px] font-bold text-left">{ele.title}</p>
              <RemoveCircleOutlineIcon className="cursor-pointer" sx={{ width: '18px' }} onClick={() => { handleEventDelete(ele.id) }} />
            </div>
            <p className="text-[12px] -mt-0.5 text-left">{dayjs(ele.date).format("DD-MM-YYYY")} {ele.startTime}-{ele.endTime}</p>
          </div>
        ))}
      </div>
      {/* ********************************************** */}

      {/* ******************* When profile value is Dashboard i.e profile === "Dashboard" **************** */}
      {profile === "Dashboard" && <div className="absolute top-0 ml-[167px] lg:w-[850px] border border-l-0 border-y-0 border-[#CBD5E1]">
        {/* Dashboard title */}
        <div className="absolute mt-4 ml-8 border border-none">
          <h1 className="text-[23px] dashboard"><span className="font-bold dashboard">Dash</span>board</h1>
        </div>

        {/* MUI DatePicker component part */}
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <div className="absolute flex flex-row right-0 mt-4 lg:mr-10 cursor-pointer border border-none" >
            <DatePicker
              value={value}
              defaultValue={value}
              disableFuture
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
            <div key={index} className={`${card.name === "Calories Burnt" ? 'w-[200px]' : 'w-[170px]'} hover:scale-105 cursor-pointer p-2 rounded-lg ${card.name === "Sleep" ? 'bg-sleep bg-cover' : card.name === "Heart Rate" ? 'bg-heart bg-cover' : 'bg-calories bg-cover'}  border border-black`} onClick={() => {
              if (card.name === "Sleep") {
                setProfile("Profile");
              }
            }}>
              <div className="flex flex-row justify-between gap-x-6">
                <p className={`text-left dashboard font-bold`}>{card.name}</p>
                <img src={`${card.name === "Heart Rate" ? heart : card.name === "Calories Burnt" ? fire : sleep}`} className="w-[40px]" />
              </div>
              <p className="text-left mt-8 dashboard text-[15px]">{card.name === "Sleep" && data.sleep[value.format("DD-MM-YYYY")] ? data.sleep[value.format("DD-MM-YYYY")].replace(":", " hours ") + " minutes" : "---"}  {card.measure}</p>
            </div>
          ))}
        </div>

        {/* User's trackers graph section */}
        <div className="absolute flex mt-[470px] lg:ml-8 pb-4 lg:w-[780px] lg:h-[380px] rounded-md border">
          <div className="mt-2 ml-[440px] h-fit justify-between space-x-3">
            {tracker_graph.map((tracker, index) => (
              <button key={index} className={`dashboard text-[14px] font-bold ${period === tracker.name ? 'bg-purple-600' : 'bg-purple-100'} border py-0.5 px-5`} onClick={() => setPeriod(tracker.name)}>{tracker.name}</button>
            ))}
            <MoreVertIcon className="cursor-pointer" onClick={() => setOpen(!open)} />
          </div>

          {/* For option tracker selection like Heart Rate*/}
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

          {/* For displaying tracker's graphs */}
          <div className="absolute flex items-center mt-12 lg:ml-5 w-[740px] h-[300px] rounded-xl border border-black">
            {option === "Sleep" ? (
              period === "Daily" ?
                <Line
                  className="mx-auto cursor-pointer"
                  style={{ width: 800 }}
                  data={chartData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Daily Sleep Hours"
                      },
                      legend: {
                        display: false
                      }
                    }
                  }}
                /> :
                period === "Weekly" ? (
                  Object.keys(data.sleep).length > 7 ?
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Weekly Sleep Hours" }, legend: { display: false } } }} />
                    :
                    <p className="mx-auto text-[35px]">No Data Available</p>) :
                  period === "Monthly" ? (
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Monthly Sleep Hours" }, legend: { display: false } } }} />
                  ) : null
            ) : option === "Calories Burnt" ? (
              <p className="mx-auto text-[35px]">No Data Available</p>
            ) : null}
          </div>
        </div>
        <div className="flex mt-[890px] border-none"></div> {/* To add bottom space. */}
      </div>}
      {/* ********************************************** */}

      {profile === "Profile" &&
        <Provider>
          <UserProfile data={data} setData={setData} />
        </Provider>
      }

    </>
  )
}

export default Profile;