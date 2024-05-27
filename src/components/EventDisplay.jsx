import React, { useState, useEffect } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { db } from '../firebase';
import { ref as dbRef, get, child } from 'firebase/database';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isEventDay',
})(({ isEventDay }) => ({
  ...(isEventDay && {
    backgroundColor: 'red',
    color: 'white',
  }),
}));

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const dbReference = dbRef(db);
      const eventsSnapshot = await get(child(dbReference, 'events'));
      if (eventsSnapshot.exists()) {
        const eventsData = eventsSnapshot.val();
        console.log("EventsData :- ",eventsData)
        const eventsList = Object.values(eventsData);
        setEvents(eventsList);
      }
    };

    fetchEvents();
  }, []);
  // console.log(events[0]);

  const renderDay = (day, selectedDates, pickersDayProps) => {
    const isEventDay = events.some(event => dayjs(event.date).isSame(day, 'day'));
    return (
      <CustomPickersDay {...pickersDayProps} isEventDay={isEventDay} />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        renderDay={renderDay}
        value={null}
        onChange={() => {}}
      />
    </LocalizationProvider>
  );
};

export default EventCalendar;