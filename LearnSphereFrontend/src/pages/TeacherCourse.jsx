import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Users, Loader2, IndianRupee } from "lucide-react"; // Existing icons

const TeacherCourse = () => {
  const { id, courseId } = useParams();
  const [course, setCourse] = useState(null); // Initialize as null for clearer loading state
  const [loading, setLoading] = useState(true); // Default to true
  const [error, setError] = useState(null); // State for handling errors
  const [userType, setUserType] = useState("STUDENT"); // Default, will be updated
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/get-course-info`,
          {
            courseId: courseId,
            token: token,
          }
        );
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          setError(response.data.message || "Failed to fetch course details.");
        }
      } catch (err) {
        console.error("Error fetching course info:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [courseId]); // Depend only on courseId, as 'id' is for teacher dashboard nav, not course data

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role) {
        setUserType(user.role);
      } else {
        // Fallback or handle case where user data is incomplete/missing
        setUserType("GUEST"); // Or another appropriate default
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      setUserType("GUEST");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mr-4" />
        <p className="text-3xl font-semibold text-gray-700">
          Loading course details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full border border-red-300">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Error Loading Course
          </h2>
          <p className="text-gray-700 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload to retry
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            The course you are looking for does not exist or you do not have
            access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-indigo-800 drop-shadow-md mb-10">
          Course Overview
        </h1>

        {/* Course Details Card */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col lg:flex-row items-start gap-8 transform transition-transform duration-500 hover:scale-[1.005]">
          <img
            src={
              course.thumbnail ||
              "https://via.placeholder.com/400x250?text=Course+Thumbnail"
            }
            alt={course.title || "Course Thumbnail"}
            className="w-full lg:w-96 h-64 object-cover rounded-xl shadow-lg flex-shrink-0 border border-gray-200"
          />
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              {course.title || "Untitled Course"}
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed">
              {course.description ||
                "A comprehensive description of this course is not yet available."}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 mt-4">
              <span className="text-2xl text-indigo-700 font-extrabold flex items-center">
                <IndianRupee className="inline-block w-6 h-6 mr-1" />
                {course.price ? course.price.toLocaleString("en-IN") : "N/A"}
              </span>
              {course.status && (
                <span
                  className={`px-4 py-2 rounded-full text-base font-semibold shadow-sm
                  ${
                    course.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : course.status === "APPROVED"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  Status: {course.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Teacher Specific Stats (Conditional Render) */}
        {userType === "TEACHER" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <div className="bg-white shadow-xl rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-green-200 transform transition-transform duration-300 hover:scale-[1.02]">
              <Users className="text-green-600 w-16 h-16 mb-4 animate-bounce-in" />
              <p className="text-xl text-gray-600 font-medium">
                Enrolled Students
              </p>
              <p className="text-5xl font-bold text-green-700 mt-2">
                {course.students ? course.students.length : 0}
              </p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-blue-200 transform transition-transform duration-300 hover:scale-[1.02]">
              <IndianRupee className="text-blue-600 w-16 h-16 mb-4 animate-bounce-in delay-100" />
              <p className="text-xl text-gray-600 font-medium">
                Total Earnings
              </p>
              <p className="text-5xl font-bold text-blue-700 mt-2">
                ₹
                {course.price && course.students
                  ? (course.price * course.students.length).toLocaleString(
                      "en-IN"
                    )
                  : 0}
              </p>
            </div>
          </div>
        )}

        {/* Demo Video Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center mt-12 border border-gray-200">
          {course.demoVideo ? (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 w-full max-w-lg mx-auto flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
              >
                ▶️ Watch Demo Video
              </button>

              {/* Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
                  <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative transform scale-95 animate-scale-up">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full p-3 text-xl shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 z-10"
                      aria-label="Close video"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-inner">
                      <iframe
                        src={course.demoVideo.replace("watch?v=", "embed/")}
                        title="Demo Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-xl font-medium mb-2">
                No demo video uploaded.
              </p>
              <p>
                You can add a demo video to this course in the course editing
                section.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourse;
