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
import TeacherCourse from "./pages/TeacherCourse";
import { UserContext } from "./contexts/userContext";
import StudentFeed from "./pages/StudentFeed";

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
          path="/student/:id"
          element={<StudentFeed />}
        />
        <Route
          path="/teacher-dashboard/:id/create-course"
          element={<CreateCourse />}
        />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/teacher-dashboard/:id/course/:courseId" element={<TeacherCourse />} />
      </Routes>
    </div>
  );
}

export default App;
