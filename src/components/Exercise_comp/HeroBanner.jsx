import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

import HeroBannerImage from '../../assets/images/banner.png';

const HeroBanner = () => (
  <>
    <div className="lg:mt-[100px] xs:mt-[70px] ml-[20px] relative text-left">
      <h1 className="text-red-600 font-semibold text-2xl lg:text-4xl xs:text-3xl">Fitness Club</h1>
      <h2 className="font-bold text-4xl lg:text-6xl xs:text-5xl mb-6 mt-8 lg:mt-30">
        Sweat, Smile <br /> And Repeat
      </h2>
      <p className="font-light text-lg lg:text-2xl xs:text-xl w-[500px] mb-8">Check out the most effective exercises personalized to you</p>
      <div className="mt-10">
        <a href="#exercises" className="block w-[200px] ml-2 text-center bg-red-600 text-white font-semibold py-4 rounded-md text-lg hover:bg-red-700 transition duration-300 ease-in-out">
          Explore Exercises
        </a>
      </div>
      <h1 className="opacity-10 hidden lg:block text-red-600 font-semibold text-8xl">Exercise</h1>
    </div>
    <img src={HeroBannerImage} alt="hero-banner" className="absolute top-0 ml-[660px] w-[600px] h-[700px]" />
  </>
);

export default HeroBanner;