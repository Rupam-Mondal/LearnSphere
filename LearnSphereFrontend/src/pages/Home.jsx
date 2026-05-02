import LandingSection from "../Components/Landing/Landingsection";
import Courses from "../Components/Landing/Courses";
import Footer from "../Components/Landing/Footer";
import WhychooseUs from "../Components/Landing/WhychooseUs";

const Home = () => {
  return (
    <div className=" ">
      <LandingSection />
      <WhychooseUs/>
      <Courses />
      <Footer />
    </div>
  );
};

export default Home;
