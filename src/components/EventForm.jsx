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
  // const [show, setShow] = useState(true); // Set it to false later
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs(currentDate));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // To view and hide Start and Time Clock
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // console.log("View: ", view);

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  }

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

  return (
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
                        <AccessTimeIcon onClick={() => setIsStartOpen(!isStartOpen)} className='cursor-pointer' />
                      </InputAdornment>
                    ),
                  }} />
                {isStartOpen ? <TimeClock sx={{
                  position: 'absolute', display: 'flex', marginLeft: '55px', top: '300px',
                  '& .MuiClock-root': {
                    backgroundColor: '#ffffff', // Clock face background color
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
                        <AccessTimeIcon onClick={() => setIsEndOpen(!isEndOpen)} className=' cursor-pointer' />
                      </InputAdornment>
                    ),
                  }} />
                {isEndOpen ? <TimeClock sx={{
                  position: 'absolute', display: 'flex', marginRight: '105px', right: 0, top: '300px',
                  '& .MuiClock-root': {
                    backgroundColor: '#ffffff', // Clock face background color
                  },
                }} ampm={false} views={['hours', 'minutes']} onChange={(newValue) => setEndTime(newValue)} /> : ''}
              </div>
            </div>
          </LocalizationProvider>
          {/* ******************************************************************** */}
          <Button
            type='submit'
            className="cursor-pointer mt-6 ml-[180px] space-x-2 px-2 py-1 font-bold bg-white text-purple-400 hover:border-purple-400 hover:border-[1.5px] rounded-md shadow-lg border"
            label="Submit"
            icon="pi pi-check"
            severity="success" text raised
          />
        </form>
      </div>
      {/* <EventCalendar /> */}
    </Dialog>
  )
}

export default EventForm;