import axios from "axios";
import React, { useEffect, useState } from "react";
import { User2Icon } from "lucide-react"; // Optional: For user icon
import { useNavigate } from "react-router-dom";

const StudentFeed = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeed = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/student/feed",
          { token }
        );
        if (response.data.success) {
          setFeed(response.data.course);
        } else {
          console.error("Failed to fetch feed:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching student feed:", error);
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Student Course Feed
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : feed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feed.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">
                    {course.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    ₹{course.price}
                  </span>
                </div>
                <p className="text-gray-600">{course.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User2Icon className="w-4 h-4" />
                  <span>Teacher: {course.teacherName || "Unknown"}</span>
                </div>
              </div>
              <div className="p-5  bg-gray-50">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={()=>{
                  navigate(`/student/course-details/${course._id}`);
                }}>
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No courses available.
        </p>
      )}
    </div>
  );
};

export default StudentFeed;
