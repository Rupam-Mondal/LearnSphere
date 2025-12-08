import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  X,
  PlayCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
// Component for the Video Player Modal
const VideoPlayerModal = ({ videoUrl, onClose }) => {
  // 1. YouTube URL Transformation
  // Standard YouTube URL transformation (https://youtu.be/ID?si=...) to embed format
  // This handles both the demo video and the lesson resources in the provided JSON structure.
  const embedUrl = videoUrl
    ? videoUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/")
    : null;

  if (!embedUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full aspect-video">
          <iframe
            // We use the transformed URL here
            src={embedUrl}
            title="Course Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const StudentCourseDetails = () => {
  // NOTE: useParams and other router components are assumed to be available
  const { id: courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  // States for Modals
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLessonVideoModal, setShowLessonVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  // States for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLessonIndex, setOpenLessonIndex] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [clickedMark, setClickedMark] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/check-progress`,
          { token: token, courseId: courseId }
        );
        if (response.data.success) {
          const completed = response.data.completedLessons.map(
            (lesson) => lesson.videoId
          );
          setCompletedLessons(completed);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [courseId, clickedMark === true]);

  const toggleLesson = (index) => {
    setOpenLessonIndex(openLessonIndex === index ? null : index);
  };

  // Function to handle opening the lesson video modal
  const openLessonVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowLessonVideoModal(true);
  };

  const enrollCourse = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to enroll in the course.");
      return;
    }

    try {
      setEnrolled(true); // Optimistic enrollment UI update
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
        // Enrollment successful, refetch data to update the course object if necessary
        fetchCourseDetails(token);
      } else {
        setEnrolled(false);
        console.error(`Enrollment failed: ${response.data.message}`);
      }
    } catch (error) {
      setEnrolled(false);
      console.error("An error occurred during enrollment.", error);
    }
  };

  const fetchCourseDetails = async (token) => {
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

      console.log("Course Details Response:", response.data);

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

  async function makeItMark(courseId, videoId) {
    setClickedMark(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to mark the lesson as completed.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/mark-as-done`,
        {
          token: token,
          courseId: courseId,
          videoId: videoId,
        }
      );

      if (response.data.success) {
        toast.success("Lesson marked as completed");
      } else {
        toast.error(`Failed to mark lesson: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while marking the lesson.");
    } finally {
      setClickedMark(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetchCourseDetails(token);
  }, [courseId]); // Re-run when the courseId changes

  // --- Loading, Error, and Not Found States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center text-lg text-gray-600 animate-pulse flex items-center p-6 rounded-xl bg-white shadow-lg">
          <Clock className="w-6 h-6 mr-2" /> Loading course details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center text-lg text-red-700 p-6 rounded-xl bg-red-100 border border-red-300 shadow-md">
          <p className="font-bold">Error Loading Course</p>
          <p className="mt-2 text-base">{error}</p>
          <p className="mt-4 text-sm text-red-600">
            Please try refreshing the page or checking your login status.
          </p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center text-lg text-gray-600 p-6 rounded-xl bg-white shadow-lg">
          No course details available for this ID.
        </div>
      </div>
    );
  }

  // --- Main Course Details UI ---
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-2xl mt-6 mb-10 font-sans">
      {/* Course Thumbnail / Demo Video Player */}
      <div className="relative overflow-hidden rounded-2xl mb-8 shadow-xl">
        <img
          src={
            courseDetails.thumbnail ||
            "https://placehold.co/1200x480/4c4d9e/ffffff?text=Course+Image"
          }
          alt={courseDetails.title}
          className="w-full h-56 sm:h-80 object-cover transform transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1200x480/4c4d9e/ffffff?text=Course+Image";
          }}
        />
        {courseDetails.demoVideo && (
          <button
            onClick={() => setShowDemoModal(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xl font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300"
            aria-label="Watch Demo Video"
          >
            <PlayCircle className="w-16 h-16 text-white hover:text-purple-300 transition-colors duration-300" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {courseDetails.title}
          </h1>
          <p className="text-lg text-gray-700 mb-6 border-b pb-4">
            {courseDetails.description}
          </p>

          {/* Meta Data */}
          <div className="grid grid-cols-2 gap-6 mb-8 py-4 border-t border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase">
                Instructor
              </p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {courseDetails.teacherName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium uppercase">
                Price
              </p>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">
                ₹{courseDetails.price || "FREE"}
              </p>
            </div>
          </div>

          {/* Status Badges */}
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
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg
                            ${
                              enrolled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-[1.01] transition-all duration-300"
                            }`}
            disabled={enrolled}
            onClick={enrollCourse}
          >
            {enrolled ? "Already Enrolled" : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* Lesson List (Enrollment Protected) */}
      {enrolled &&
        courseDetails.lessons &&
        courseDetails.lessons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" /> Course Content
            </h2>
            <div className="space-y-3">
              <div className="w-full max-w-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {completedLessons.length}/{courseDetails.lessons.length}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        courseDetails.lessons.length > 0
                          ? (completedLessons.length /
                              courseDetails.lessons.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {Math.round(
                    courseDetails.lessons.length > 0
                      ? (completedLessons.length /
                          courseDetails.lessons.length) *
                          100
                      : 0
                  )}
                  % Completed
                </p>
              </div>

              {courseDetails.lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Lesson Header/Toggle Button */}
                  <button
                    className={`w-full text-left p-5 flex justify-between items-center transition-colors duration-200
                                        ${
                                          openLessonIndex === index
                                            ? "bg-blue-50"
                                            : "bg-gray-50 hover:bg-gray-100"
                                        }`}
                    onClick={() => toggleLesson(index)}
                  >
                    <span className="text-lg font-semibold text-gray-800 flex-1">
                      <span className="text-blue-600 mr-2">
                        Lecture {index + 1}:
                      </span>{" "}
                      {lesson.title}
                    </span>
                    {completedLessons.includes(lesson.videoId) && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {openLessonIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-500" />
                    )}
                  </button>

                  {/* Lesson Content (Resources) */}
                  {openLessonIndex === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      {lesson.videoUrl ? (
                        <ul className="space-y-4">
                          {lesson.videoUrl ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
                              {/* Video Resource Display */}
                              <div className="flex items-center gap-3 flex-1">
                                <PlayCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <span className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                                  {lesson.title || `Video ${index + 1}`}
                                </span>
                              </div>

                              {/* Buttons Section */}
                              <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto">
                                <button
                                  onClick={() =>
                                    openLessonVideo(lesson.videoUrl)
                                  }
                                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  Show Video
                                </button>

                                {completedLessons.includes(lesson.videoId) ? (
                                  <button
                                    disabled
                                    className="px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-500 transition-all shadow-sm hover:shadow w-full md:w-auto bg-gray-500 text-white hover:text-white cursor-not-allowed flex items-center justify-center gap-2"
                                  >
                                    Mark as Done
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      makeItMark(courseId, lesson.videoId);
                                    }}
                                    className="px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100 transition-all shadow-sm hover:shadow w-full md:w-auto bg-blue-500 text-white hover:text-black cursor-pointer flex items-center justify-center gap-2"
                                  >
                                    Mark as Done
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* General File/Link Resource Display */}
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <a
                                  href={lesson.otherUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-800 font-medium truncate"
                                >
                                  {lesson.title ||
                                    `Resource Link ${resIndex + 1}`}
                                </a>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0">
                                Document/Link
                              </span>
                            </>
                          )}
                          {/* </li>
                                                ))} */}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic p-3">
                          No resources available for this lesson.
                        </p>
                      )}
                      {lesson.resources.length > 0 ? (
                        <ul className="space-y-4">
                          {lesson.resources.map((resource, resIndex) => (
                            <li key={resIndex}>
                              {/* General File/Link Resource Display */}
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <a
                                  href={resource || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-800 font-medium truncate"
                                >
                                  {" "}
                                  click here to view resource
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic p-3">
                          No additional resources available for this lesson.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {courseDetails.lessons.length > 0 &&
        (completedLessons.length / courseDetails.lessons.length) * 100 ===
          100 && (
          <div className="mt-10 p-6 bg-green-100 border border-green-300 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🎉 Congratulations You have Completed the Course! 🎉
            </h2>
            <p className="text-green-700">
              {" "}
              You are now eligible for the virtual interview, and you will
              receive your certificate once you pass.{" "}
            </p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Proceed to Virtual Interview
            </button>
          </div>
        )}

      {enrolled && (
        <div>
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              💬 Comments
            </h2>
            <CommentSection courseId={courseId} />
          </div>
        </div>
      )}
      {/* Demo Video Modal */}
      {showDemoModal && (
        <VideoPlayerModal
          videoUrl={courseDetails.demoVideo}
          onClose={() => setShowDemoModal(false)}
        />
      )}

      {/* Lesson Video Modal */}
      {showLessonVideoModal && currentVideoUrl && (
        <VideoPlayerModal
          videoUrl={currentVideoUrl}
          onClose={() => setShowLessonVideoModal(false)}
        />
      )}
    </div>
  );
};

const CommentSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem("token");

  // --- Decode token to get user role ---
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // assumes JWT includes { id, role }
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents newline
              handleAddComment(); // Calls the comment handler
            }
          }}
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
                  {userRole === "teacher" && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id
                        )
                      }
                      className="text-sm text-blue-600 mt-1 hover:underline"
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
                  {replyingTo === comment._id && userRole === "teacher" && (
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

export default StudentCourseDetails;
