import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + "/admin/pending-courses"
          );
          const data = await response.data;
          console.log("Fetched courses:", data.courses);
          if (data.success) {
            setCourses(data.courses);
          } else {
            console.error("Failed to fetch courses:", data.message);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };

      fetchCourses();
    }
  }, []);

  const toggleDescription = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const approveCourse = async (courseId) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/approve-course",
        { courseId }
      );
      const data = await response.data;
      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        console.log("Course approved successfully");
      } else {
        console.error("Failed to approve course:", data.message);
      }
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const rejectCourse = async (courseId) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/reject-course",
        { courseId }
      );
      const data = await response.data;
      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        console.log("Course rejected successfully");
      } else {
        console.error("Failed to reject course:", data.message);
      }
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Course Approval Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4">Thumbnail</th>
              <th className="px-6 py-4">Teacher</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4">
                  <img
                    src={course.thumbnail}
                    alt="Course Thumbnail"
                    className="w-24 h-16 object-cover rounded-lg border"
                  />
                </td>
                <td className="px-6 py-4 font-medium">
                  {course.teacher.username}
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  {course.price}
                </td>
                <td className="px-6 py-4 max-w-sm">
                  <button
                    onClick={() => toggleDescription(course._id)}
                    className="text-blue-600 hover:underline focus:outline-none"
                  >
                    {expanded === course._id ? "Hide" : "Show"}
                  </button>
                  {expanded === course._id && (
                    <p className="mt-2 text-gray-600">{course.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full shadow"
                    onClick={() => {
                      approveCourse(course._id);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full shadow"
                    onClick={() => {
                      rejectCourse(course._id);
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
