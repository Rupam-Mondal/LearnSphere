import React from 'react'
import Navbar from '../Components/Navbar/Navbar';
import Stylebar from '../Components/Stylebar/Stylebar';
import LandingSection from '../Components/Landing/Landingsection';

const Home = () => {
  return (
    <div className=" ">
      <Navbar />
      <div className="relative py-10 w-full h-auto flex flex-col justify-center items-center border border-red-500 min-h-screen">
        <Stylebar />
        <LandingSection />
      </div>
    </div>
  );
}

export default Home
