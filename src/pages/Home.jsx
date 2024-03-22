import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Exercise_comp/Navbar';

import Exercises from '../components/Exercise_comp/Exercises';
import SearchExercises from '../components/Exercise_comp/SearchExercises';
import HeroBanner from '../components/Exercise_comp/HeroBanner';

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');

  return (
    <Box>
      <Navbar />
      <HeroBanner />
      <SearchExercises setExercises={setExercises} bodyPart={bodyPart} setBodyPart={setBodyPart} />
      <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />
    </Box>
  );
};

export default Home;