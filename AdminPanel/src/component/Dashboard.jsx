import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/admin/pending-courses"
        );
        const data = response.data; 
        console.log("Fetched courses:", data.courses);
        if (data.success) {
          setCourses(data.courses);
        } else {
          console.error("Failed to fetch courses:", data.message);
          setError(data.message || "Failed to fetch courses.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false); 
      }
    };

    fetchCourses();
  }, [navigate]); 

  const toggleDescription = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const approveCourse = async (courseId) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/approve-course",
        { courseId }
      );
      const data = response.data;
      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        toast.success("Course approved successfully!");
      } else {
        console.error("Failed to approve course:", data.message);
        toast.error(`Failed to approve course: ${data.message}`); 
      }
    } catch (error) {
      console.error("Error approving course:", error);
      toast.error("An error occurred while approving the course.");
    }
  };

  const rejectCourse = async (courseId) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/reject-course",
        { courseId }
      );
      const data = response.data;
      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        toast.success("Course rejected successfully!");
      } else {
        console.error("Failed to reject course:", data.message);
        toast.error(`Failed to reject course: ${data.message}`); 
      }
    } catch (error) {
      console.error("Error rejecting course:", error);
      toast.error("An error occurred while rejecting the course."); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="ml-4 text-2xl font-semibold text-gray-700">
          Loading pending courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full border border-red-300">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6 sm:p-8 md:p-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 drop-shadow-md mb-4 sm:mb-0 text-center sm:text-left leading-tight">
          📚 Course Approval Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 text-base font-semibold"
        >
          Logout
        </button>
      </div>

      
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {courses.length === 0 ? (
          <div className="p-8 md:p-12 text-center text-xl md:text-2xl text-gray-600 font-semibold">
            🎉 No pending courses to review! All clear!
          </div>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            <table className="min-w-full text-sm md:text-base text-left text-gray-700">
              <thead className="text-xs md:text-sm uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 md:px-6 md:py-4 rounded-tl-xl w-24 md:w-auto"
                  >
                    Thumbnail
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 md:px-6 md:py-4 w-52 md:w-1/3"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 md:px-6 md:py-4 text-center rounded-tr-xl"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200 ease-in-out"
                  >
                    <td className="p-4 md:px-6 md:py-4">
                      <img
                        src={
                          course.thumbnail ||
                          "https://via.placeholder.com/100x60?text=No+Image"
                        }
                        alt={`Thumbnail for ${course.title}`}
                        className="w-20 h-14 md:w-28 md:h-18 object-cover rounded-lg shadow-sm border border-gray-100"
                      />
                    </td>
                    <td className="p-4 md:px-6 md:py-4 font-medium text-gray-800 whitespace-nowrap">
                      {course.teacher?.username || "Unknown"}
                    </td>
                    <td className="p-4 md:px-6 md:py-4 font-bold text-green-700 whitespace-nowrap">
                      ₹{course.price?.toLocaleString("en-IN") || "0"}
                    </td>
                    <td className="p-4 md:px-6 md:py-4 max-w-xs md:max-w-lg">
                      <p
                        className={`text-gray-600 ${
                          expanded === course._id ? "" : "line-clamp-2"
                        }`}
                      >
                        {course.description || "No description provided."}
                      </p>
                      {course.description &&
                        course.description.length > 100 && (
                          <button
                            onClick={() => toggleDescription(course._id)}
                            className="mt-2 text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md text-sm"
                          >
                            {expanded === course._id
                              ? "Show Less"
                              : "Read More"}
                          </button>
                        )}
                    </td>
                    <td className="p-4 md:px-6 md:py-4 text-center space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center items-center">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 transform hover:scale-105 active:scale-95 text-sm w-full sm:w-auto"
                        onClick={() => approveCourse(course._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 transform hover:scale-105 active:scale-95 text-sm w-full sm:w-auto"
                        onClick={() => rejectCourse(course._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
