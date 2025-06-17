import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import TeacherDashBoard from "./pages/TeacherDashBoard";
import CreateCourse from "./Components/TeacherDashBoard/CreateCourse";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher-dashboard/:id" element={<TeacherDashBoard />} />
        <Route path="/teacher-dashboard/:id/create-course" element={<CreateCourse />} />
      </Routes>
    </>
  );
}

export default App;
