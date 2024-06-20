import EventCalendar from './EventDisplay';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
// MUI Date Calendar components
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { TextField, InputAdornment } from '@mui/material';
// Clock Icon
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
// Firebase
import { ref as dbRef, push } from 'firebase/database';
import { auth, db } from '../firebase';

const EventForm = ({ addEvent, view, setView }) => {
  let currentDate = new Date().toDateString();
  const stepsDate = dayjs(currentDate).format("DD-MM-YYYY");
  // const [show, setShow] = useState(true); // Set it to false later
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs(currentDate));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // To view and hide Start and Time Clock
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // console.log("View: ", view);
  // console.log("Steps: ",steps);
  // console.log(dayjs(currentDate).format("DD-MM-YYYY"));

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  }

  // For steps 
  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   setData({
  //     ...data,
  //     steps: {
  //       ...data.steps,
  //       [stepsDate]: value
  //     }
  //   })
  // }
  // console.log(data);

  // For events
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !startTime || !endTime) {
      toast.error("Please fill all details.");
      return
    }

    const user = auth.currentUser;
    const userRef = dbRef(db, `events/${user.uid}`);
    const snapshot = await push(userRef, { title, date: date.toISOString(), startTime: startTime.format("HH:mm"), endTime: endTime.format("HH:mm") });
    const newEvent = {
      id: snapshot.key,
      title,
      date: date.toISOString(),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm")
    };
    addEvent(newEvent);
    setView(false);
    toast.success("Event Created 🗓️");

    setTitle('');
    setDate(dayjs(currentDate));
    setStartTime(null);
    setEndTime(null);
  }

  // For Steps
  // const handleStepsSubmit = async (e) => {
  //   e.preventDefault();
  //   if (data.steps[stepsDate] === 1) {
  //     toast.error("Please enter steps count");
  //     return
  //   }
  //   const userRef = dbRef(db, `UserData/${auth.currentUser.uid}`);
  //   await databaseUpdate(userRef, data).then((val1) => {
  //     toast.success("Steps count updated", val1);
  //   }
  //   ).catch((error) => {
  //     toast.error("Error occured", error);
  //   });
  //   setSteps(false);

  // }

  return (
    <>
      {/* <Dialog
        visible={steps}
        onHide={() => setSteps(false)}
        className="absolute flex lg:top-[180px] lg:w-[350px] border rounded-md bg-white"
        header={() => (<p>Enter today's steps count</p>)}
      >
        <div className="flex flex-col gap-y-4">
          <input type="number" placeholder="Steps count" name="steps" value={data.steps[stepsDate] || ''} onChange={handleChange}
            className="outline-none focus:border-cyan-400 lg:pl-1 lg:py-1 border-[1.4px] border-black rounded-md" />
          <Button
            onClick={handleStepsSubmit}
            className="lg:w-[90px] text-purple-400 font-bold lg:px-2 lg:py-1 mx-auto shadow-md hover:border-purple-400 hover:border-[1.5px] border"
            label="Submit"
            icon="pi pi-check"
          />
        </div>
      </Dialog> */}
      <Dialog
        visible={view}
        onHide={() => setView(false)}
        className='absolute flex top-[20px] border rounded-md bg-white'
        header={() => (
          <p className='font-bold'>Add Event</p>
        )}
      >
        <div className='flex flex-col justify-between gap-y-2 p-4 border border-dashed rounded-md w-[500px] border-black'>
          <form onSubmit={handleSubmit}>
            {/* ************ Event Tile ****************** */}
            <div className='flex flex-col'>
              <p className='mb-1 font-bold'>Event Title</p>
              <input type='text' name='title' value={title} onChange={handleInputChange} className='focus:border-emerald-300 outline-none lg:p-1 rounded-md border border-black' />
            </div>
            {/* ***************************************** */}

            {/* ************ Event Date ****************** */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className='mt-1'>
                <p className='mb-1 font-bold'>Event Date</p>
                <DatePicker
                  value={date}
                  defaultValue={date}
                  onChange={(newValue) => setDate(newValue)}
                  sx={{
                    '& .MuiInputBase-input': {
                      width: '110px',
                      height: '10px',
                      paddingY: '12px',
                      ":focus": 'green',
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6EE7B7',
                        borderWidth: '1.5px'
                      },
                    },
                  }}
                />
              </div>
            </LocalizationProvider>
            {/* ********************************************************** */}

            {/* ************* Start and End Time ************************** */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className='flex flex-row gap-x-20 mt-1'>
                <div className=''> {/* For Start Time */}
                  <p className='mb-1 font-bold'>Start Time</p>
                  <TextField value={startTime ? startTime.format("HH:mm") : ''}
                    sx={{
                      '&.MuiTextField-root': {
                        width: '180px',

                      },
                      '& .MuiInputBase-root': {
                        height: '40px',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccessTimeIcon onClick={() => { setIsStartOpen(!isStartOpen); setIsEndOpen(false); }} className='cursor-pointer' />
                        </InputAdornment>
                      ),
                    }} />
                  {isStartOpen ? <TimeClock sx={{
                    position: 'absolute', display: 'flex', marginLeft: '110px', top: '20px', zIndex: 20,
                    '& .MuiClock-root': {
                      backgroundColor: '#ffffff', // Clock face background color
                      width: '200px',
                      height: '200px'
                    },
                  }} ampm={false} views={['hours', 'minutes']} onChange={(newValue) => setStartTime(newValue)} /> : ''}
                </div>
                <div className=''> {/* For End Time */}
                  <p className='mb-1 font-bold'>End Time</p>
                  <TextField value={endTime ? endTime.format("HH:mm") : ''}
                    sx={{
                      '&.MuiTextField-root': {
                        width: '180px',

                      },
                      '& .MuiInputBase-root': {
                        height: '40px',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccessTimeIcon onClick={() => { setIsEndOpen(!isEndOpen); setIsStartOpen(false); }} className=' cursor-pointer' />
                        </InputAdornment>
                      ),
                    }} />
                  {isEndOpen ? <TimeClock sx={{
                    position: 'absolute', display: 'flex', marginRight: '80px', right: 0, top: '20px',
                    '& .MuiClock-root': {
                      backgroundColor: '#ffffff', // Clock face background color
                      width: '200px',
                      height: '200px',
                    },
                  }} ampm={false} views={['hours', 'minutes']} onChange={(newValue) => setEndTime(newValue)} /> : ''}
                </div>
              </div>
            </LocalizationProvider>
            {/* ******************************************************************** */}
            <Button
              type='submit'
              className="cursor-pointer mt-6 ml-[180px] space-x-2 lg:px-2 lg:py-1 font-bold bg-white text-purple-400 hover:border-purple-400 hover:border-[1.5px] rounded-md shadow-lg border"
              label="Submit"
              icon="pi pi-check"
              severity="success" text raised
            />
          </form>
        </div>
        {/* <EventCalendar /> */}
      </Dialog>
    </>
  )
}

export default EventForm;