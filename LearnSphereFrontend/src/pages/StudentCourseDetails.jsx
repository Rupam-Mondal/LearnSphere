import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { X, PlayCircle, CheckCircle, Clock } from "lucide-react";

const StudentCourseDetails = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const enrollCourse = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to enroll in the course.");
      return;
    }

    try {
      setEnrolled(true); 
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/enroll-course`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Successfully enrolled in the course!");
      } else {
        setEnrolled(false);
        alert(`Enrollment failed: ${response.data.message}`);
      }
    } catch (error) {
      setEnrolled(false);
      alert("An error occurred during enrollment. Please try again.");
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to be logged in to view course details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/course-details`,
          { courseId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCourseDetails(response.data.course);
          setEnrolled(response.data.enrolled);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Could not load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center text-lg text-gray-600 animate-pulse flex items-center">
          <Clock className="w-6 h-6 mr-2" /> Loading course details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center text-lg text-red-700 p-4 rounded-lg bg-red-100 border border-red-300 shadow-md">
          <p>Error: {error}</p>
          <p className="mt-2 text-base text-red-600">
            Please try refreshing the page or logging in again.
          </p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center text-lg text-gray-600">
          No course details available.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      
      <div className="relative overflow-hidden rounded-xl mb-8 shadow-md">
        <img
          src={courseDetails.thumbnail}
          alt={courseDetails.title}
          className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {courseDetails.demoVideo && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xl font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300"
            aria-label="Watch Demo Video"
          >
            <PlayCircle className="w-16 h-16 text-white hover:text-purple-300 transition-colors duration-300" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {courseDetails.title}
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {courseDetails.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-b py-6 border-gray-200">
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase">
                Instructor
              </p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {courseDetails.teacherName}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-gray-500 font-medium uppercase">
                Price
              </p>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">
                ₹{courseDetails.price}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className={`px-5 py-2 text-base rounded-full font-semibold flex items-center gap-2
                ${
                  courseDetails.status === "APPROVED"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                }`}
            >
              <CheckCircle className="w-5 h-5" /> Status: {courseDetails.status}
            </span>

            <span
              className={`px-5 py-2 text-base rounded-full font-semibold flex items-center gap-2
                ${
                  enrolled
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
            >
              {enrolled ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              {enrolled ? "You are enrolled" : "Not enrolled"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <button
            className={`w-full py-4 rounded-xl text-white font-bold text-lg
              ${
                enrolled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              }`}
            disabled={enrolled}
            onClick={enrollCourse}
          >
            {enrolled ? "Already Enrolled" : "Enroll Now"}
          </button>

          
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full aspect-video">
              <iframe
                src={courseDetails.demoVideo.replace("watch?v=", "embed/")}
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseDetails;
