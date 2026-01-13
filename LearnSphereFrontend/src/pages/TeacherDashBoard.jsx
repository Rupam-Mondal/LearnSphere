import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import demo from "../assets/demo/demo.jpg";
import { UserContext } from "../contexts/userContext";
import axios from "axios";
import toast from "react-hot-toast";

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useContext(UserContext);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/get-courses`,
          { token: token || localStorage.getItem("token") }
        );
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          toast.error("Failed to fetch courses:", response.data.message);
        }
      } catch (error) {
        toast.error("Error fetching courses:", error);
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

  const countStudents = (courses) => {
    let total = 0;
    for (var i = 0; i < courses.length; i++) {
      total += courses[i].students.length;
    }
    return total;
  };

  const calculateEarnings = (courses) => {
    let totalEarnings = 0;
    for (let i = 0; i < courses.length; i++) {
      totalEarnings += courses[i].price * courses[i].students.length;
    }
    return totalEarnings;
  };

  const calculatePendings = (courses) => {
    let totalPendings = 0;
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].status === "PENDING") {
        totalPendings += 1;
      }
    }
    return totalPendings;
  }

  if (!user || !user.username) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 py-8 md:px-8 pt-12 md:py-20">
      <header className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 drop-shadow-lg leading-tight">
          Teacher Dashboard
        </h1>
        <p className="text-gray-700 mt-4 text-xl font-medium">
          Welcome,{" "}
          <span className="font-bold text-blue-700">
            {capitalize(user.username)}
          </span>
          ! Manage your courses and track your progress.
        </p>


        {
          user?.teacherDetails?.approved?.toUpperCase()  == "PENDING" && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              Your teacher account is currently {user?.teacherDetails?.approved?.toLowerCase()}. Please wait for admin approval to access all features.
            </div>
          
        )
        }
        {
          user?.teacherDetails?.approved?.toUpperCase()  == "REJECTED" && (
            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              Your teacher account is currently {user?.teacherDetails?.approved?.toLowerCase()}. Please contact admin for approval to access all features.
            </div>
          
        )
        }
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 mb-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Earnings</h2>
          <p className="text-4xl font-bold text-green-600 mt-3">
            ₹{calculateEarnings(courses)}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Students</h2>
          <p className="text-4xl font-bold text-indigo-600 mt-3">
            {countStudents(courses)}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Courses</h2>
          <p className="text-4xl font-bold text-black mt-3">{courses.length}</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Pendings</h2>
          <p className="text-4xl font-bold text-red-600 mt-3">
            {calculatePendings(courses)}
          </p>
        </div>

        {
          user?.teacherDetails?.approved?.toUpperCase()  === "APPROVED" && (
            <div className="sm:col-span-2 md:col-span-3 xl:col-span-4 flex justify-center">
          <button
            onClick={() => navigate(`/teacher-dashboard/${id}/create-course`)}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg w-full sm:w-auto"
          >
            + Create New Course
          </button>
        </div>
          )
        }
      </section>

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
                {course.status === "APPROVED" && (
                  <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Approved
                  </span>
                )}
                {course.status === "REJECTED" && (
                  <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Rejected
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
