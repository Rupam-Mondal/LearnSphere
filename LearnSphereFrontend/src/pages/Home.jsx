import LandingSection from "../Components/Landing/Landingsection";
import Courses from "../Components/Landing/Courses";
import Footer from "../Components/Landing/Footer";
import Testimonials from "../Components/Landing/Testimonials";


const Home = () => {
  return (
    <div className=" ">
      <LandingSection />
      <Courses />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
