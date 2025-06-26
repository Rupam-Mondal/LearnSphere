import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentCourseDetails = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found.");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/course-details`,
          { courseId, token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setCourseDetails(response.data.course);
          setEnrolled(response.data.enrolled);
        } else {
          console.error(
            "Failed to fetch course details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching course details:", error.message);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!courseDetails) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      {/* Thumbnail */}
      <img
        src={courseDetails.thumbnail}
        alt={courseDetails.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      {/* Title & Description */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {courseDetails.title}
      </h1>
      <p className="text-gray-600 mb-4">{courseDetails.description}</p>

      {/* Instructor & Price */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Instructor</p>
          <p className="text-lg font-semibold text-gray-700">
            {courseDetails.teacherName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-xl font-bold text-blue-600">
            ₹{courseDetails.price}
          </p>
        </div>
      </div>

      {/* Status and Enrollment */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className={`px-4 py-1 text-sm rounded-full font-medium ${
            courseDetails.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Status: {courseDetails.status}
        </span>

        <span
          className={`px-4 py-1 text-sm rounded-full font-medium ${
            enrolled ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
          }`}
        >
          {enrolled ? "You are enrolled" : "Not enrolled"}
        </span>
      </div>

      {/* Demo Video Button */}
      {courseDetails.demoVideo && (
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            ▶️ Watch Demo Video
          </button>
        </div>
      )}

      {/* Enroll Button */}
      <div className="mt-4">
        <button
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            enrolled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={enrolled}
        >
          {enrolled ? "Already Enrolled" : "Enroll Now"}
        </button>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-4 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-black border border-black hover:text-white bg-gray-200 hover:bg-red-500 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Close video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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

            <div className="w-full aspect-video">
              <iframe
                src={courseDetails.demoVideo.replace("watch?v=", "embed/")}
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseDetails;
