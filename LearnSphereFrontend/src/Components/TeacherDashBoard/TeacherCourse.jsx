import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Loader2,
  IndianRupee,
  Video, // Added for the demo video section
  DollarSign, // Using a more generic icon for 'Price/Earnings' display consistency
  BookOpen, // Added for content section
  Edit2, // Added for the edit/upload button
  X, // Close icon for modal
} from "lucide-react";
import UploadCourses from "./UploadCourses";
import { jwtDecode } from "jwt-decode";

const TeacherCourse = () => {
  const { id, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("STUDENT");
  const [showModal, setShowModal] = useState(false);
  // const [lessons, setLessons] = useState([]);

  const StatusBadge = ({ status }) => {
    let classes =
      "px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase shadow-sm";
    let text = status || "DRAFT";

    switch (status) {
      case "PENDING":
        classes +=
          " bg-yellow-100 text-yellow-800 border border-yellow-300 ring-1 ring-yellow-200";
        break;
      case "APPROVED":
        classes +=
          " bg-green-100 text-green-800 border border-green-300 ring-1 ring-green-200";
        break;
      case "REJECTED":
        classes +=
          " bg-red-100 text-red-800 border border-red-300 ring-1 ring-red-200";
        break;
      default:
        classes +=
          " bg-gray-100 text-gray-700 border border-gray-300 ring-1 ring-gray-200";
        text = "DRAFT";
    }

    return <span className={classes}>Status: {text}</span>;
  };

  useEffect(() => {
    const fetchCourseInfo = async () => {
      setLoading(true);
      setError(null);
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
  }, [courseId]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role) {
        setUserType(user.role);
      } else {
        setUserType("GUEST");
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      setUserType("GUEST");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-20 w-20 text-indigo-600 animate-spin mb-4" />
          <p className="text-4xl font-extrabold text-gray-800">
            Fetching Course Data...
          </p>
          <p className="text-lg text-gray-500 mt-2">
            This might take a moment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="bg-white rounded-xl shadow-2xl p-10 text-center max-w-lg w-full border-t-4 border-red-500">
          <h2 className="text-3xl font-bold text-red-700 mb-4">
            ⚠️ Error Loading Course
          </h2>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md transform hover:scale-[1.01]"
          >
            Attempt to Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-2xl p-10 text-center max-w-lg w-full border-t-4 border-indigo-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🔍 Course Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            The course ID **{courseId}** is invalid, or you do not have
            permission to view this resource.
          </p>
          <a
            href="/teacher/dashboard"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 leading-tight">
          Course Management:{" "}
          <span className="text-indigo-600">{course.title}</span>
        </h1>

        <div className="bg-white shadow-3xl rounded-3xl p-6 md:p-10 flex flex-col xl:flex-row items-start gap-8 border-t-8 border-indigo-500">
          <img
            src={
              course.thumbnail ||
              "https://via.placeholder.com/600x400?text=Course+Thumbnail"
            }
            alt={course.title || "Course Thumbnail"}
            className="w-full xl:w-1/3 h-72 object-cover rounded-2xl shadow-xl flex-shrink-0 border-4 border-white ring-1 ring-gray-200 transition-shadow duration-300 hover:shadow-2xl"
          />
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-snug">
                {course.title || "Untitled Course"}
              </h2>
              {course.status && <StatusBadge status={course.status} />}
            </div>

            <p className="text-gray-600 text-lg border-l-4 border-indigo-300 pl-4 py-1 italic">
              {course.description ||
                "A comprehensive description of this course is not yet available."}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-gray-100">
              <span className="text-3xl text-green-700 font-extrabold flex items-center bg-green-50 p-3 rounded-lg shadow-inner">
                {/* <DollarSign className="inline-block w-7 h-7 mr-2 text-green-500" /> */}
                {course.price
                  ? `₹ ${course.price.toLocaleString("en-IN")}`
                  : "Free / N/A"}
              </span>

              {course.category && (
                <span className="text-lg text-indigo-700 font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {course.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {userType === "TEACHER" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 pt-6 border-b pb-2">
              Performance Insights 📊
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col items-center justify-center border-b-4 border-green-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <Users className="text-green-600 w-12 h-12 mb-3" />
                <p className="text-lg text-gray-500 font-medium uppercase tracking-wider">
                  Enrolled Students
                </p>
                <p className="text-5xl font-extrabold text-green-700 mt-2">
                  {course.students ? course.students.length : 0}
                </p>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col items-center justify-center border-b-4 border-blue-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <IndianRupee className="text-blue-600 w-12 h-12 mb-3" />
                <p className="text-lg text-gray-500 font-medium uppercase tracking-wider">
                  Potential Earnings (₹)
                </p>
                <p className="text-5xl font-extrabold text-blue-700 mt-2">
                  ₹
                  {course.price && course.students
                    ? (course.price * course.students.length).toLocaleString(
                        "en-IN"
                      )
                    : 0}
                </p>
              </div>
              <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col items-center justify-center border-b-4 border-purple-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <Video className="text-purple-600 w-12 h-12 mb-3" />
                <p className="text-lg text-gray-500 font-medium uppercase tracking-wider">
                  Modules/Videos
                </p>
                <p className="text-5xl font-extrabold text-purple-700 mt-2">
                  {course.modules?.length || 0}
                </p>
              </div>
            </div>
          </>
        )}
        {/* --- End Teacher Stats --- */}

        {/* Demo Video Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 text-center border-t-4 border-orange-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <Video className="w-8 h-8 mr-3 text-orange-500" />
            Course Preview
          </h2>
          {course.demoVideo ? (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 w-full max-w-lg mx-auto flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.98]"
              >
                ▶️ Launch Demo Video
              </button>

              {/* Modal (Improved) */}
              {showModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                  onClick={() => setShowModal(false)} // Close when clicking outside
                >
                  <div
                    className="bg-white w-full max-w-5xl p-6 rounded-2xl shadow-3xl relative transform transition-transform duration-300"
                    onClick={(e) => e.stopPropagation()} // Prevent modal closing when clicking inside
                  >
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full p-2.5 text-xl shadow-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 z-10"
                      aria-label="Close video"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-inner ring-2 ring-gray-100">
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
            <div className="text-center text-gray-500 py-6 border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <Video className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-xl font-semibold mb-1 text-gray-700">
                No Demo Video Available
              </p>
              <p className="text-md">
                Upload a demo video link to showcase your course content.
              </p>
            </div>
          )}
        </div>
        {/* --- End Demo Video Section --- */}

        {/* Upload/Content Management Section (Dedicated Card) */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border-t-4 border-indigo-500/50">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Edit2 className="w-8 h-8 mr-3 text-indigo-500" />
            Course Content Management
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <UploadCourses course={course} />
          </div>
        </div>
        {/* --- End Content Management Section --- */}
      </div>
      <div>
        <div>
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              💬 Comments
            </h2>
            <CommentSection courseId={courseId} />
          </div>
        </div>
      </div>
    </div>
  );
};
const CommentSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const token = localStorage.getItem("token");

  // --- Decode token to get user role ---
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role.toUpperCase()); // assumes JWT includes { id, role }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token]);

  // --- Fetch comments from backend ---
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/get-by-course`,
        { courseID: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && courseId) fetchComments();
  }, [courseId]);

  // --- Add a new comment ---
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!token) {
      console.error("Please log in to post a comment.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/add`,
        { courseID: courseId, text: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNewComment("");
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // --- Add a reply (teacher only) ---
  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    if (!token) {
      console.error("Please log in to reply.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/add-reply`,
        { commentID: commentId, text: replyText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReplyText("");
        setReplyingTo(null);
        fetchComments(); // Refresh
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
      {/* Add Comment */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a public comment..."
          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors shadow-md self-end sm:self-start"
        >
          Comment
        </button>
      </div>

      {/* Comments */}
      {loading ? (
        <p className="text-gray-500 italic">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 italic">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                  {comment.userID?.username
                    ? comment.userID.username[0].toUpperCase()
                    : "U"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {comment.userID?.username || "Unknown User"}
                  </p>
                  <p className="text-gray-700">{comment.text}</p>

                  {/* Only teacher can reply */}
                  {role === "TEACHER" && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault(); // Prevents default scrolling on Space
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          );
                        }
                      }}
                      className="text-sm text-blue-600 mt-1 hover:underline"
                      tabIndex={0} // makes it focusable via keyboard
                    >
                      Reply
                    </button>
                  )}

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-8 mt-3 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex items-start gap-3 bg-gray-100 p-3 rounded-xl"
                        >
                          <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full text-sm font-bold">
                            {reply.user?.username
                              ? reply.user.username[0].toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {reply.user?.username || "User"}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Box (only for teacher) */}
                  {replyingTo === comment._id && role === "TEACHER" && (
                    <div className="mt-3 ml-8 flex flex-col sm:flex-row gap-3">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TeacherCourse;
