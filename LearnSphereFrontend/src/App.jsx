import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import TeacherDashBoard from "./pages/TeacherDashBoard";
import CreateCourse from "./Components/TeacherDashBoard/CreateCourse";
import AuthPage from "./pages/AuthPage";
import TeacherDashboard from "./pages/TeacherDashBoard";
import Bot from "./Components/Bot/Bot";

function App() {
  return (
    <div className="w-full h-full">
      {localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("user"))?.role === "STUDENT" ? (
        <Bot />
      ) : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashBoard />} />
        <Route
          path="/teacher-dashboard/:id/create-course"
          element={<CreateCourse />}
        />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
