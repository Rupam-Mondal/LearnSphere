import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Stylebar from "../Components/Stylebar/Stylebar";
import LandingSection from "../Components/Landing/Landingsection";
import Courses from "../Components/Landing/Courses";

const Home = () => {
  return (
    <div className=" ">
      <Navbar />
      <LandingSection />
      <Courses />
    </div>
  );
};

export default Home;
