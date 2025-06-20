import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import demo from "../assets/demo/demo.jpg";
import { UserContext } from "../contexts/userContext";
import axios from "axios";

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useContext(UserContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const earnings = 10500;
  const totalStudents = 150;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
    else setToken(null);
  }, [setToken, setUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/get-courses`,
          { token: localStorage.getItem("token") }
        );
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Failed to fetch courses:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token || localStorage.getItem("token")) {
      fetchCourses();
    }
  }, [token]);

  const capitalize = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (!user || !user.username) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 md:px-10">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome,{" "}
          <span className="font-semibold">{capitalize(user.username)}</span>
        </p>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Earnings</h2>
          <p className="text-4xl font-bold text-green-600 mt-3">
            ₹{earnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Students</h2>
          <p className="text-4xl font-bold text-indigo-600 mt-3">
            {totalStudents.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate(`/teacher-dashboard/${id}/create-course`)}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg w-full sm:w-auto"
          >
            + Create New Course
          </button>
        </div>
      </section>

      {/* Course Section */}
      {loading ? (
        <div className="text-center text-xl text-gray-500 mt-10 animate-pulse">
          Loading Courses...
        </div>
      ) : courses.length > 0 ? (
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 relative"
              >
                <img
                  src={course.thumbnail || demo}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.status === "PENDING" && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Pending
                  </span>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </p>
                  
                  
                  <button
                    onClick={() =>
                      navigate(`/teacher-dashboard/${id}/course/${course._id}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            No Courses Created Yet
          </h2>
          <p className="text-gray-600 mb-4">
            You haven't created any courses yet.
          </p>
        </section>
      )}
    </div>
  );
};

export default TeacherDashboard;
