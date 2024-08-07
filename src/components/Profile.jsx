import { user_profiles } from ".";
import { dashboard_card } from ".";
import { tracker_graph } from ".";
import { useState, useContext, useEffect } from "react";
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
import { createTheme, ThemeProvider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
// Framer motion
import { motion } from 'framer-motion';
// Importing pics
import dashboard_fitness from '../assets/Dashboard_fitness.png';
import footsteps from '../assets/footsteps.png';
import sleep from '../assets/sleeping.png';
import user from '../assets/user.png';
import glass from '../assets/water-bottle.png';
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

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 250,
      sm: 650, // Custom value for small screens
      md: 768, // Custom value for medium screens
      lg: 1024, // Custom value for large screens
    },
  },
});

const Profile = () => {
  const navigate = useNavigate();
  const { profile, setProfile, setUser, data, setData } = useContext(GlobalContext); // profile for sidebar, usetUser for logout, data for user's data such as name, image.
  // console.log("Profile component :- ",profile);

  // **************** Dashboard top calendar **********************
  let currentDate = new Date().toDateString();
  const [val, setVal] = useState(dayjs(currentDate));

  const [period, setPeriod] = useState("Daily"); {/* For displaying Weekly, Monthly graph */ }
  const [open, setOpen] = useState(false); {/* For selecting trackers */ }
  const [option, setOption] = useState("Steps count");
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

  // ****************** For toggling right side bar ******************
  const [toggle, setToggle] = useState(false);
  // ***************************************

  // **************** For xs device displaying graph ***************
  const [showGraph, setShowGraph] = useState(false);
  // ***************************************************************

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
        // label: option === "Sleep" ? "Sleep hours" : option === "Water Tracker" ? "Hydration level" : option === "Steps count" ? "Steps" : "",
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

    var waterData = Object.entries(data.water_intake).map(([date, count]) => ({
      date: new Date(date.split("-").reverse().join("-")),
      count
    }));

    var stepsData = Object.entries(data.steps).map(([date, step]) => ({
      date: new Date(date.split("-").reverse().join("-")),
      step
    }));

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
      temp = temp.slice(-123); // 123 is expected maximum days in 4 months i.e July, August, September, October
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

    if (option === "Water Tracker" && period === "Daily") {
      let temp = waterData.sort((a, b) => a.date - b.date);
      temp = temp.map((item) => ({
        ...item,
        date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      }));
      var waterDailyData = temp.slice(-7);
    }

    if (option === "Water Tracker" && period === "Weekly") {
      let temp = waterData.sort((a, b) => a.date - b.date);
      temp = temp.map((item) => ({
        ...item,
        date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      }));
      temp = temp.slice(-28);
      let weekCount = 1;
      let currentWeek = [];
      var waterWeekData = {};

      for (let i = 0; i < temp.length; i++) {
        currentWeek.push(temp[i].count);
        if (currentWeek.length === 7 || i === temp.length - 1) {
          let sumCount = currentWeek.reduce((sum, item) => sum + parseInt(item), 0);
          let avgCount = sumCount / currentWeek.length;
          waterWeekData[`week${weekCount}`] = avgCount.toFixed(2);
          weekCount++;
          currentWeek = [];
        }
      }
    }

    if (option === "Water Tracker" && period === "Monthly") {
      let temp = waterData.sort((a, b) => a.date - b.date);
      // temp = temp.map((item) => ({
      //   ...item,
      //   date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      // }));
      temp = temp.slice(-123);
      var monthNames = [(temp[0].date).toLocaleString('default', { month: 'long' })];
      var currentMonthCount = [];
      var waterMonthlyData = [];

      for (let i = 0; i < temp.length; i++) {
        if (monthNames.slice(-1) == (temp[i].date).toLocaleString('default', { month: 'long' }) && i !== temp.length - 1) {
          currentMonthCount.push(temp[i].count);
        }
        else {
          if (i !== temp.length - 1) {
            monthNames.push((temp[i].date).toLocaleString('default', { month: 'long' }));
          }
          else {
            currentMonthCount.push(temp[i].count);
          }
          const totalMonthCounts = currentMonthCount.reduce((sum, item) => sum + parseInt(item), 0);
          const avgMonthCounts = totalMonthCounts / currentMonthCount.length;
          waterMonthlyData.push(avgMonthCounts.toFixed(2));
          currentMonthCount = [temp[i].count];
        }
      }
    }

    if (option === "Steps count" && period === "Daily") {
      let temp = stepsData.sort((a, b) => a.date - b.date);
      temp = temp.map((item) => ({
        ...item,
        date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      }));
      var stepsDailyData = temp.slice(-7);
    }

    if (option === "Steps count" && period === "Weekly") {
      let temp = stepsData.sort((a, b) => a.date - b.date);
      temp = temp.map((item) => ({
        ...item,
        date: `${String(item.date.getDate()).padStart(2, '0')}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getFullYear())}`
      }));
      temp = temp.slice(-28);
      let weekCount = 1;
      let currentWeek = [];
      var stepsWeekData = {};

      for (let i = 0; i < temp.length; i++) {
        currentWeek.push(temp[i].step);
        if (currentWeek.length === 7 || i === temp.length - 1) {
          let sumStepsCount = currentWeek.reduce((sum, item) => sum + parseFloat(item), 0);
          let avgStepsCount = sumStepsCount / currentWeek.length;
          stepsWeekData[`week${weekCount}`] = avgStepsCount;
          weekCount++;
          currentWeek = [];
        }
      }
    }

    if (option === "Steps count" && period === "Monthly") {
      let temp = stepsData.sort((a, b) => a.date - b.date);
      temp = temp.slice(-123);
      var monthNames = [temp[0].date.toLocaleDateString('default', { month: 'long' })];
      var currentMonthCount = [];
      var stepsMonthlyData = [];

      for (let i = 0; i < temp.length; i++) {
        if (monthNames.slice(-1) == (temp[i].date).toLocaleString('default', { month: 'long' }) && i !== temp.length - 1) {
          currentMonthCount.push(temp[i].step);
        }
        else {
          if (i !== temp.length - 1) {
            monthNames.push((temp[i].date).toLocaleString('default', { month: 'long' }));
          }
          else {
            currentMonthCount.push(temp[i].step);
          }
          const totalMonthCounts = currentMonthCount.reduce((sum, item) => sum + parseInt(item), 0);
          const avgMonthCounts = totalMonthCounts / currentMonthCount.length;
          stepsMonthlyData.push(avgMonthCounts.toFixed(2));
          currentMonthCount = [temp[i].step];
        }
      }
    }

    setChartData({
      labels: option === "Sleep" && period === "Daily" ? sleepDailyData.map(item => item.date) : option === "Sleep" && period === "Weekly" ? Object.keys(finalWalaResult) : option === "Sleep" && period === "Monthly" ? monthNames : option === "Water Tracker" && period === "Daily" ? waterDailyData.map(item => item.date) : option === "Water Tracker" && period === "Weekly" ? Object.keys(waterWeekData) : option === "Water Tracker" && period === "Monthly" ? monthNames : option === "Steps count" && period === "Daily" ? stepsDailyData.map(item => item.date) : option === "Steps count" && period === "Weekly" ? Object.keys(stepsWeekData) : option === "Steps count" && period === "Monthly" ? monthNames : [],
      datasets: [
        {
          ...chartData.datasets[0],
          data: option === "Sleep" && period === "Daily" ? sleepDailyData.map(item => item.hours) : option === "Sleep" && period === "Weekly" ? Object.values(finalWalaResult) : option === "Sleep" && period === "Monthly" ? results : option === "Water Tracker" && period === "Daily" ? waterDailyData.map(item => item.count) : option === "Water Tracker" && period === "Weekly" ? Object.values(waterWeekData) : option === "Water Tracker" && period === "Monthly" ? waterMonthlyData : option === "Steps count" && period === "Daily" ? stepsDailyData.map(item => item.step) : option === "Steps count" && period === "Weekly" ? Object.values(stepsWeekData) : option === "Steps count" && period === "Monthly" ? stepsMonthlyData : [],
        }
      ]
    });

  }, [data, user_id, option]); // useEffect Runs whenever there is change in data, user_id [ when user logs in ] and changes options i.e to sleep, water_intake etc.

  const fade = () => {
    return {
      hidden: {
        opacity: window.innerWidth < 650 ? 0 : 1,
        translateX: window.innerWidth < 650 ? -20 : 0
      },
      visible: {
        opacity: window.innerWidth < 650 ? 1 : 1,
        translateX: window.innerWidth < 650 ? 0 : 0,
        transition: {
          type: "spring",
          duration: 1,
          delay: 0.1,
        }
      }
    }
  }
  // *****************************************************************

  return (
    <>
      {/* ************ For the side bar *************** */} {/* Do replace || with && before toggle */}
      {(window.innerWidth > 649 || (window.innerWidth <= 649 && toggle)) && <motion.div initial="hidden" animate="visible" variants={fade()} className={`absolute flex flex-col top-0 left-0 lg:w-[16.5%] md:w-[18%] sm:w-[19%] xs:w-[9rem] h-[162%] z-[10] bg-gradient-to-tr from-[#AD1DEB] to-[#6E72FC] border border-[#AD1DEB]`}>
        <div className='flex flex-row sm:justify-normal xs:justify-start xs:space-x-2 sm:space-x-0 items-end mt-4 mb-12 sm:mx-auto sm:pl-0 xs:pl-2 border-black border-none'> {/* For Healthify title.*/}
          <ThemeProvider theme={theme}><CloseIcon className="text-white" sx={{ display: { sm: 'none' } }} onClick={() => setToggle(!toggle)} /></ThemeProvider>
          <div><h1 className='lg:text-[23px] md:text-[21px] sm:text-[20px] xs:text-[18px] text-white'><span className='font-bold'>Health</span>ify</h1></div>
        </div>
        {/* For displaying each profile such as dashboard, profile etc. */}
        {user_profiles.map((item, index) => (
          <div key={index} className="flex flex-row md:gap-x-3 xs:gap-x-2 w-fit lg:ml-[20%] md:ml-[13%] sm:ml-[12%] xs:ml-[10%] mb-6 cursor-pointer border-black border-none">
            {item.name === "Profile" ? <FontAwesomeIcon className={`mt-1 w-5 -ml-0.8 text-white ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} icon={faUser} /> : item.name === "Dashboard" ? <DashboardIcon sx={{ width: 18, height: 25, color: 'white' }} className={`${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Exercise" ? <FitnessCenterIcon sx={{ width: 19, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : item.name === "Logout" ? <LogoutIcon sx={{ width: 18, height: 22, color: 'white' }} className={`mt-0.5 ${profile === item.name ? 'brightness-100' : 'brightness-50'}`} /> : ''}
            <p className={`text-white sm:text-[15px] md:text-[16px] ${profile === item.name ? 'font-bold' : ''}`} onClick={() => {
              setProfile(item.name);
              if (item.name === "Logout") {
                setUser(null);
                toast.success("Logged Out Successfully");
                navigate("/");
              }
            }}>{item.name}</p>
          </div>
        ))}
      </motion.div>}
      {/* ******** For xs devices menu Icon ************ */}
      {!toggle && <div className="sm:invisible absolute flex top-0 left-0 xs:visible w-full px-3 py-2 border-none border-black">
        <MenuIcon onClick={() => setToggle(!toggle)} />
      </div>}
      {/* ********************************************** */}

      {/* *************** For right side bar ****************** */}
      {/* User's Image upload */}
      <div className={`${profile === "Profile" ? 'xs:invisible sm:visible' : '' } absolute flex flex-col top-14 lg:ml-[85.5%] md:ml-[84%] sm:ml-[77%] xs:ml-[56%] border-black border-none`}>
        <img src={data.image ? data.image : user} className="lg:w-[75%] md:w-[70%] sm:w-[80%] xs:w-[70%] cursor-pointer mx-auto brightness-50"
          onClick={() => setImagecrop(true)} alt="" />
        <p className="mt-2 font-bold text-[17px]">{data.first_name} {data.last_name}</p>
        <Dialog
          visible={imagecrop}
          className="bg-purple-50 rounded-lg"
          onHide={() => setImagecrop(false)}
          header={() => (
            <p className="font-bold">Upload Image</p>
          )}
          style={{ width: '350px', height: '350px'}}
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
        <a className="text-[12px] mt-2 cursor-pointer text-cyan-600" onClick={() => setProfile("Profile")}>Edit health details</a>
      </div>

      {/* Displaying user's weight, height and age */}
      <div className={`${profile === "Profile" ? 'xs:invisible sm:visible' : '' } absolute flex lg:flex-row xs:flex-col lg:px-[1%] md:px-0 sm:px-[1%] xs:px-1 lg:py-2 md:py-0 sm:py-[0.4%] xs:py-1.5 top-[220px] lg:ml-[83%] md:ml-[83%] sm:ml-[77%] xs:ml-[54.5%] justify-between lg:gap-x-2 bg-[#f4faff] rounded-md border`}>
        <div className="flex lg:flex-col items-center sm:flex-row lg:gap-0 sm:gap-x-1 xs:gap-x-1">
          <p className="md:text-[14px] sm:text-[13px] xs:text-[15px] font-bold">Weight</p>
          <p className="md:text-[14px] sm:text-[13px] xs:text-[14px]">{data.weight ? data.weight : '---'}</p>
        </div>
        <div className="flex lg:flex-col items-center sm:flex-row lg:gap-0 sm:gap-x-1 xs:gap-x-1">
          <p className="md:text-[14px] sm:text-[13px] xs:text-[15px] font-bold">Height</p>
          <p className="md:text-[14px] sm:text-[13px] xs:text-[14px]">{data.height * 30.48} cm</p>
        </div>
        <div className="flex lg:flex-col items-center sm:flex-row lg:gap-0 sm:gap-x-1 xs:gap-x-1">
          <p className="md:text-[14px] sm:text-[13px] xs:text-[15px] font-bold">Age</p>
          <p className="md:text-[14px] sm:text-[13px] xs:text-[14px]">{data.age}</p>
        </div>
      </div>

      {/* Schedule Part */}
      <div className={`${profile === "Profile" ? 'xs:invisible sm:visible' : '' } absolute flex flex-row lg:space-x-[12%] md:space-x-[10%] sm:space-x-[8%] xs:space-x-[4%] lg:top-[310px] md:top-[315px] sm:top-[300px] xs:top-[310px] md:ml-[82%] sm:ml-[76%] xs:ml-[53%] border border-none`}>
        <p className="font-bold dashboard_schedule lg:text-[16px] md:text-[15px] sm:text-[14px] xs:text-[15px]">Scheduled</p>
        <ThemeProvider theme={theme}> <AddCircleIcon className="left-0 cursor-pointer border border-none text-black" sx={{ width: { lg: '20px', md: '18%', sm: '19%', xs: '18%' }, marginTop: { md: 0, sm: '-1.5px', xs: '-0.8px' } }} onClick={() => setEventView(true)} /></ThemeProvider>
        {eventView && <EventForm addEvent={addEvent} view={eventView} setView={setEventView} />}
      </div>
      <div className={`${profile === "Profile" ? 'xs:invisible sm:visible' : '' } absolute flex flex-col lg:top-[350px] md:top-[345px] sm:top-[330px] xs:top-[350px] md:ml-[82%] sm:ml-[75%] xs:ml-[53%] xs:mr-[2%] justify-between gap-y-2`}>
        {/* Apply map function to show all scheduled task from firebase */}
        {events && events.map((ele) => (
          <div key={ele.id} className="flex flex-col lg:px-2.5 lg:py-1 md:px-1 md:py-1 sm:px-1 sm:py-0.5 xs:px-1 xs:py-0.5 rounded-md border border-black">
            <div className="flex flex-row border lg:w-[170px] justify-between border-none">
              <p className="md:text-[14px] sm:text-[13px] xs:text-[15px] font-bold text-left">{ele.title}</p>
              <RemoveCircleOutlineIcon className="cursor-pointer" sx={{ width: { md: '18px', sm: '16px', xs: '17px' } }} onClick={() => { handleEventDelete(ele.id) }} />
            </div>
            <p className="md:text-[12px] sm:text-[11px] xs:text-[12px] -mt-0.5 text-left">{dayjs(ele.date).format("DD-MM-YYYY")} {ele.startTime}-{ele.endTime}</p>
          </div>
        ))}
      </div>
      {/* ********************************************** */}

      {/* ******************* When profile value is Dashboard i.e profile === "Dashboard" **************** */}
      {profile === "Dashboard" && <div className="absolute sm:left-auto xs:-left-3 sm:top-0 xs:top-8 lg:ml-[14%] md:ml-[15%] sm:ml-[14%] lg:w-[67%] md:w-[66%] sm:w-[60%] xs:w-[62%] border border-l-0 border-y-0 border-[#CBD5E1]">
        {/* Dashboard title */}
        <div className="absolute mt-4 ml-8 border-black border-none">
          <h1 className="lg:text-[23px] md:text-[21px] sm:text-[18px] xs:text-[1.1rem] dashboard"><span className="font-bold dashboard">Dash</span>board</h1>
        </div>

        {/* MUI DatePicker component part */}
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <div className="absolute flex flex-row sm:right-0 sm:mt-4 xs:-mt-6 md:mr-10 sm:mr-[4%] xs:ml-[110%] cursor-pointer border border-none" >
            <ThemeProvider theme={theme}>
              <DatePicker
                value={val}
                defaultValue={val}
                disableFuture
                onChange={(newValue) => setVal(newValue)}
                sx={{
                  '& .MuiInputBase-input': {
                    width: {
                      md: '110px',
                      sm: '100px',
                      xs: '70px'
                    },
                    fontSize: {
                      md: '16px',
                      sm: '15px',
                      xs: '13px'
                    },
                    height: {
                      md: '10px',
                      sm: '6px',
                      xs: '1px'
                    },
                    paddingY: {
                      md: '12px',
                      sm: '11px',
                      xs: '11px'
                    },
                  },
                }}
              />
            </ThemeProvider>
          </div>
        </LocalizationProvider>

        {/* Welcome to Fitness! part */}
        <div className="absolute flex sm:flex-row xs:flex-col sm:mt-20 xs:mt-14 sm:mr-0 xs:mr-4 md:ml-8 sm:ml-6 xs:ml-7 sm:w-[90%] lg:p-4 md:p-2 sm:p-2 rounded-xl border">
          <img src={dashboard_fitness} className="lg:w-[370px] lg:h-[190px] md:w-[360px] md:h-[170px] sm:w-[320px] sm:h-[150px] xs:w-[190px] xs:h-[100px] rounded-xl" />
          <div className="flex flex-col"> {/* To display both p elements in column instead in row */}
            <p className="lg:ml-5 md:ml-[2%] sm:ml-0 lg:mt-14 md:mt-[17%] sm:mt-[21%] xs:mt-[3%] lg:text-[28px] md:text-[21px] sm:text-[16px] xs:text-[15px] font-bold">Welcome to Fitness!</p>
            <p className="lg:ml-8 md:ml-[4%] sm:ml-0 sm:pb-0 sm:px-0 xs:px-2 xs:pb-2 lg:mt-2 md:mt-2 sm:text-[16px] xs:text-[13px]"> Start Today, Feel Stronger Tomorrow.</p>
          </div>
        </div>

        {/* Trackers section */}
        {/* #A1C4FD -> #C2E9FB , br #91A6FF -> #FFFFFF */}
        {/*Heart rate :- bg-gradient-to-bl from-[#ff4f4f] to-[#ffb2b2]
        Calories burnt :- bg-gradient-to-tl from-[#FFFF00] to-[#ff5151]
        Sleep :- bg-gradient-to-l from-[#A1C4FD] to-[#C2E9FB]*/}
        {/* tr #D3D3D3 -> #FF6B6B, #FF7878 -> #FFFFFF */}
        <div className="absolute flex sm:flex-row xs:flex-col lg:mt-[330px] md:mt-[300px] sm:mt-[270px] xs:mt-[260px] lg:ml-[4%] lg:mr-0 md:ml-[5%] md:mr-[5%] sm:ml-[6%] sm:mr-[6%] xs:ml-[12%] justify-between md:gap-x-8 sm:gap-x-2 xs:gap-y-2 rounded-xl border-none border-fuchsia-500">
          {dashboard_card.map((card, index) => (
            <div key={index} className={`md:w-[70%] sm:w-[90%] sm:h-auto xs:w-[90%] xs:h-[120px] ${card.name === "Water Tracker" ? 'lg:w-[200px]' : 'lg:w-[170px]'} hover:scale-105 cursor-pointer p-2 rounded-lg ${card.name === "Sleep" ? 'bg-sleep bg-cover' : card.name === "Steps count" ? 'bg-steps bg-cover' : 'bg-water bg-cover'}  border border-black`} onClick={() => setProfile("Profile")}>
              <div className="flex flex-row justify-between sm:gap-x-6">
                <p className={`text-left h-fit lg:text-[16px] md:text-[14px] sm:text-[13px] xs:text-[16px] dashboard font-bold`}>{card.name}</p>
                <img src={`${card.name === "Steps count" ? footsteps : card.name === "Water Tracker" ? glass : sleep}`} className={`md:w-[40px] sm:w-[40%] xs:w-[20%]`} />
              </div>
              <p className={`text-left dashboard lg:mt-8 ${card.name === "Sleep" && data.sleep[val.format("DD-MM-YYYY")] ? 'md:text-[15px] sm:text-[13px] sm:mt-6 xs:mt-12' : 'md:text-[15px] md:mt-10 sm:mt-8 xs:mt-12'} `}>{card.name === "Sleep" && data.sleep[val.format("DD-MM-YYYY")] ? data.sleep[val.format("DD-MM-YYYY")].replace(":", " hours ") + " minutes" : card.name === "Water Tracker" && data.water_intake[val.format("DD-MM-YYYY")] ? data.water_intake[val.format("DD-MM-YYYY")] : card.name === "Steps count" && data.steps[val.format("DD-MM-YYYY")] ? data.steps[val.format("DD-MM-YYYY")] : "---"}  {card.measure}</p>
            </div>
          ))}
        </div>

        {/* User's trackers graph section */}
        <div className="absolute flex lg:mt-[470px] md:mt-[450px] sm:mt-[410px] xs:mt-[660px] lg:ml-[4%] sm:ml-[5%] xs:ml-[12%] pb-4 sm:w-[90%] xs:w-[80%] sm:h-[42%] xs:h-[20%] rounded-md border">
          <div className="absolute flex flex-row mt-2 right-0 lg:mr-[5%] md:mr-[4%] sm:mr-[3%]  border-none border-black h-fit justify-between space-x-3">
            {window.innerWidth > 649 && tracker_graph.map((tracker, index) => (
              <button key={index} className={`dashboard lg:text-[14px] md:text-[13px] sm:text-[12px] font-bold ${period === tracker.name ? 'bg-purple-600' : 'bg-purple-100'} border py-0.5 lg:px-5 md:px-3 sm:px-2`} onClick={() => setPeriod(tracker.name)}>{tracker.name}</button>
            ))}
            {window.innerWidth <= 649 && <select name="period" className="sm:invisible xs:visible flex mr-12 rounded-md border border-black" onChange={(e) => setPeriod(e.target.value)}>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>}
            <MoreVertIcon className="cursor-pointer" onClick={() => setOpen(!open)} />
          </div>

          {/* ********** For xs devices View graph :- Graph will display inside dialogue box if user clicks on this */}
          <p className="sm:invisible xs:visible mt-[80px] mx-auto dashboard cursor-pointer text-[15px]" onClick={() => setShowGraph(true)}>View Graph</p>
          
          {/* ********** For xs devices to show users inside Dialogue box ******** */}
          <Dialog
            visible={showGraph}
            className="bg-purple-50 rounded-lg"
            onHide={() => setShowGraph(false)}
            header={() => (
              <p className="font-bold">{option}</p>
            )}
            style={{ width: '280px', height: '280px'}}

          >
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
            ) : option === "Water Tracker" ? (
              period === "Daily" ?
                <Line className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Daily water intake" }, legend: { display: false } } }} />
                :
                period === "Weekly" ?
                  <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Weekly Hydration Levels" }, legend: { display: false } } }} /> :
                  period === "Monthly" ?
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Monthly Hydration Levels" }, legend: { display: false } } }} /> :
                    <p className="mx-auto text-[35px]">No Data Available</p>
            ) : option === "Steps count" ? (
              period === "Daily" ?
                <Line className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Daily Steps count" }, legend: { display: false } } }} /> :
                period === "Weekly" ?
                  <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Weekly Steps count" }, legend: { display: false } } }} /> :
                  period === "Monthly" ?
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Monthly Steps count" }, legend: { display: false } } }} /> : null
            ) : null
            }
          </Dialog>

          {/* For option tracker selection like Heart Rate*/}
          {open && <div className="absolute flex flex-col right-0 mt-10 lg:mr-[6%] sm:mr-[5%] w-fit px-3 py-1 bg-white z-20 items-start space-y-1 rounded-md border">
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Steps count");
              setOpen(!open);
            }}>Steps count</p>
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Water Tracker");
              setOpen(!open);
            }}>Water Tracker</p>
            <p className="text-[14px] dashboard cursor-pointer" onClick={() => {
              setOption("Sleep");
              setOpen(!open);
            }}>Sleep</p>
          </div>}

          {/* For displaying tracker's graphs */}
          <div className="sm:visible absolute xs:invisible flex items-center mt-12 sm:ml-[4%] sm:w-[92%] h-[300px] rounded-xl border border-black">
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
            ) : option === "Water Tracker" ? (
              period === "Daily" ?
                <Line className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Daily water intake" }, legend: { display: false } } }} />
                :
                period === "Weekly" ?
                  <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Weekly Hydration Levels" }, legend: { display: false } } }} /> :
                  period === "Monthly" ?
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Monthly Hydration Levels" }, legend: { display: false } } }} /> :
                    <p className="mx-auto text-[35px]">No Data Available</p>
            ) : option === "Steps count" ? (
              period === "Daily" ?
                <Line className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Daily Steps count" }, legend: { display: false } } }} /> :
                period === "Weekly" ?
                  <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Weekly Steps count" }, legend: { display: false } } }} /> :
                  period === "Monthly" ?
                    <Bar className="mx-auto cursor-pointer" data={chartData} style={{ width: 800 }} options={{ plugins: { title: { display: true, text: "Monthly Steps count" }, legend: { display: false } } }} /> : null
            ) : null
            }
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