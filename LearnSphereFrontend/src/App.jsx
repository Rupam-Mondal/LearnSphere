import LandingSection from "./Components/Landing/Landingsection";
import Navbar from "./Components/Navbar/Navbar";

import Stylebar from "./Components/Stylebar/Stylebar";
import './App.css';

function App(){
  return (
    <>
      <Navbar/>
      <div className="relative py-10 w-full h-auto flex flex-col justify-center items-center">
        <Stylebar/>
        <LandingSection/>
      </div>
      
    </>
  )
}

export default App;
