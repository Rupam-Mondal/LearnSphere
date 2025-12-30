import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import StudentCourseDetails from "./pages/StudentCourseDetails";
import StudentDashboard from "./Components/StudentDashboard/StudentDashboard";
import Practice from "./pages/Practice";
import Java from "./pages/Java";
import Oops from "./pages/Oops";

function App() {
  const [bot, setBot] = useState(false);
  const { token } = useContext(UserContext);
  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("user"))?.role === "STUDENT"
    ) {
      setBot(true);
    } else {
      setBot(false);
    }
  }, [token]);
  return (
    <div className="w-full h-full">
      {bot ? <Bot /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashBoard />} />
        <Route
          path="/student/feed"
          element={<StudentFeed />}
        />
        <Route
          path="/student/course-details/:id"
          element={<StudentCourseDetails />}
        />


        <Route
          path="/teacher-dashboard/:id/create-course"
          element={<CreateCourse />}
        />
        {/* <Route path="/teacher-dashboard/:id" element={<TeacherDashboard />} /> */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/teacher-dashboard/:id/course/:courseId" element={<TeacherCourse />} />
        <Route path="/student/dashboard/:id" element={<StudentDashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/Java" element={<Java />} />
        <Route path="/practice/oops" element={<Oops />} />
      </Routes>
    </div>
  );
}

export default App;
