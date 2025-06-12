import LandingSection from "./Components/Landing/Landingsection";

import Stylebar from "./Components/Stylebar/Stylebar";

function App(){
  return (
    <>
      <div className="relative py-10 w-full h-auto flex flex-col justify-center items-center">
        <Stylebar/>
        <LandingSection/>
      </div>
      
    </>
  )
}

export default App;
