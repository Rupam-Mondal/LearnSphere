import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import TeacherDashBoard from "./pages/TeacherDashBoard";
import CreateCourse from "./Components/TeacherDashBoard/CreateCourse";
import AuthPage from "./pages/AuthPage";
import TeacherDashboard from "./pages/TeacherDashBoard";
import Bot from "./Components/Bot/Bot";
import React, { useContext, useEffect, useState } from "react";
import TeacherCourse from "./Components/TeacherDashBoard/TeacherCourse";
import { UserContext } from "./contexts/userContext";
import StudentFeed from "./pages/StudentFeed";
import StudentCourseDetails1 from "./pages/StudentCourseDetails1";
import StudentDashboard from "./Components/StudentDashboard/StudentDashboard";
import Practice from "./pages/Practice";
import Java from "./pages/Java";
import Oops from "./pages/Oops";
import Navbar from "./Components/Navbar/Navbar";
import Teachers from "./pages/Teachers";
import TeacherHome from "./pages/Teacher/TeacherHome";
import TeacherNavbar from "./Components/Navbar/TeacherNavbar";
import TeacherAuth from "./pages/Teacher/TeacherAuth";

function App() {
  const [bot, setBot] = useState(false);
  const [nav, setNav] = useState(true);

  const { token } = useContext(UserContext);
  const role = useLocation().pathname.split("/")[1];

  useEffect(() => {
    console.log("role", role);
    if (role.toLowerCase().includes("teacher")) {
      setNav(false);
    } else {
      setNav(true);
    }
    if (
      localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("user"))?.role === "STUDENT"
    ) {
      setBot(true);
    } else {
      setBot(false);
    }
  }, [token, role]);
  return (
    <div className="w-full h-full">
      {nav ? <Navbar /> : <TeacherNavbar />}
      {bot ? <Bot /> : null}

      <Routes>
        {/* student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student/feed" element={<StudentFeed />} />
        <Route
          path="/student/course-details/:id"
          element={<StudentCourseDetails1 />}
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/student/dashboard/:id" element={<StudentDashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/Java" element={<Java />} />
        <Route path="/practice/oops" element={<Oops />} />
        <Route path="/all/teachers" element={<Teachers />} />




        {/* Teacher Routes */}
        <Route path="/teacher-Home" element={<TeacherHome />} />
        <Route path="/teacher-auth" element={<TeacherAuth />} />
        <Route
          path="/teacher-dashboard/:id/course/:courseId"
          element={<TeacherCourse />}
        />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashBoard />} />
        <Route
          path="/teacher-dashboard/:id/create-course"
          element={<CreateCourse />}
        />
      </Routes>
    </div>
  );
}

export default App;
