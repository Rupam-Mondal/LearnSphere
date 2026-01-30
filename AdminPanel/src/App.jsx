import React from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import TeacherProfile from "./pages/TeacherProfile";

const App = () => {
  return (
    <div>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/teacher-profile/:teacherId"
              element={<TeacherProfile />}
            />
          </Routes>
        </div>
    </div>
  );
};

export default App;
