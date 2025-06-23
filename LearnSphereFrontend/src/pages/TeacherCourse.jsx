import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Users, Loader2, IndianRupee } from "lucide-react";

const TeacherCourse = () => {
  const { id, courseId } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("STUDENT");

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/teacher/get-course-info",
          {
            courseId: courseId,
            token: localStorage.getItem("token"),
          }
        );
        setCourse(response.data.course);
        console.log("Course Info:", response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course info:", error);
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [id, courseId]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUserType(user.role);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-3xl text-gray-600">
        <Loader2 className="animate-spin mr-3" /> Loading...
      </div>
    );
  }

  

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700">
          Course Dashboard
        </h1>

        {/* Course Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 transition duration-300 hover:shadow-2xl">
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className="w-full sm:w-60 h-40 sm:h-40 object-cover rounded-xl"
          />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h2 className="text-5xl font-bold text-gray-800">
              {course.title || "Course Title"}
            </h2>
            <p className="text-gray-600 text-xl">
              {course.description || "Course Description"}
            </p>
            <p className="text-lg text-indigo-600 font-medium">
              Price: ₹{course.price || 0}
            </p>
            {course.status === "PENDING" ? (
              <p className="text-yellow-600 font-semibold">
                Status: Pending Approval
              </p>
            ) : course.status === "APPROVED" ? (
              <p className="text-green-600 font-semibold">Status: Approved</p>
            ) : (
              <p className="text-red-600 font-semibold">Status: Rejected</p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {userType === "TEACHER" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition duration-300">
              <Users className="mx-auto text-green-500 w-8 h-8 mb-2" />
              <p className="text-sm text-gray-500">Enrolled Students</p>
              <p className="text-3xl font-bold text-green-600">
                {course?.students?.length || 0}
              </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition duration-300">
              <IndianRupee className="mx-auto text-blue-500 w-8 h-8 mb-2" />
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{course?.price ? course.price * course.students.length : 0}
              </p>
            </div>
          </div>
        )}

        {course?.demoVideo ? (
          <div className="bg-white shadow-md rounded-2xl p-6 space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Demo Video</h2>
            <a
              href={course.demoVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:underline hover:text-blue-800 transition text-lg"
            >
              🔗 Watch Demo Video
            </a>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-2xl p-6 text-center text-gray-500">
            <p>No demo video has been uploaded for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourse;
