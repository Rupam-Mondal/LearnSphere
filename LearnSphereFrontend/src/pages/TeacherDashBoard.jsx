import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import demo from "../assets/demo/demo.jpg"; 

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React for Beginners",
      image: demo,
    },
    {
      id: 2,
      title: "Node.js Essentials",
      image: demo,
    },
    {
      id: 3,
      title: "Node.js Essentials",
      image: demo,
    },
  ]);

  const earnings = 10500;
  const totalStudents = 150;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 md:px-10">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome, <span className="font-semibold">Teacher ID: {id}</span>
        </p>
      </header>

      {/* Stats & Create Button */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Earnings */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Earnings</h2>
          <p className="text-4xl font-bold text-green-600 mt-3">
            ₹{earnings.toLocaleString()}
          </p>
        </div>

        {/* Total Students */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Students</h2>
          <p className="text-4xl font-bold text-indigo-600 mt-3">
            {totalStudents.toLocaleString()}
          </p>
        </div>

        {/* Create Course Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate(`/teacher-dashboard/${id}/create-course`)}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg w-full sm:w-auto"
          >
            + Create New Course
          </button>
        </div>
      </section>

      {/* Course List */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {course.title}
                </h3>
                <button
                  onClick={() =>
                    navigate(`/teacher-dashboard/${id}/course/${course.id}`)
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
    </div>
  );
};

export default TeacherDashboard;
