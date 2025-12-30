import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  PlayCircle,
  Star,
  Users,
  Globe,
  Award,
  ChevronRight,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/userContext";

const VideoPlayerModal = ({ videoUrl, onClose }) => {
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

const StudentCourseDetails1 = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLessonVideoModal, setShowLessonVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLessonIndex, setOpenLessonIndex] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [clickedMark, setClickedMark] = useState(false);
  const {token} = useContext(UserContext);

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

  const openLessonVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowLessonVideoModal(true);
  };

  const enrollCourse = async () => {
    if (!token) {
      toast.error("Please log in to enroll in the course.");
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
  }, [courseId]);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1c1d1f] text-white pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-6 uppercase tracking-wider">
              <span>{courseDetails?.topic}</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300">{courseDetails?.title}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {courseDetails?.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
              {courseDetails?.description ||
                "Master the fundamentals and advanced concepts in this comprehensive guide designed for all skill levels."}
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="text-lg">4.8</span>
                <Star className="w-5 h-5 fill-current" />
                <span className="text-gray-400 font-normal text-sm ml-1 underline underline-offset-4">
                  (12,430 ratings)
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-5 h-5 text-purple-400" />
                <span>
                  {courseDetails?.students.length || 0} students enrolled
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>English [Auto]</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl ring-4 ring-purple-900/30">
                {courseDetails?.teacherName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <p className="font-bold text-purple-400 hover:underline cursor-pointer">
                  {courseDetails?.teacherName}
                </p>
              </div>
            </div>

            <div className="w-full mt-20 bg-[#2e2e30] text-white rounded p-10 shadow-lg">
              <h2 className="text-3xl font-extrabold mb-8">
                What you’ll learn
              </h2>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseDetails?.topicCover.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3  text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5 text-white mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:w-[40%] lg:w-[30%]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden sticky top-28">
              <div className="relative group cursor-pointer">
                <img
                  src={
                    courseDetails?.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800"
                  }
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <div
                  onClick={() => {
                    setShowDemoModal(true);
                  }}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PlayCircle className="w-16 h-16 text-white" />
                  <span className="text-white font-bold mt-2">
                    Preview this course
                  </span>
                </div>
              </div>

              <div className="p-8 text-gray-900">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black">
                    ₹{courseDetails?.price || "499"}
                  </span>
                </div>

                {enrolled ? (
                  <>
                    <button
                      disabled
                      className="cursor-not-allowed w-full bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 mb-4 shadow-lg shadow-gray-200"
                    >
                      Already Enrolled
                    </button>
                  </>
                ) : (
                  <button 
                  onClick={enrollCourse}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 mb-4 shadow-lg shadow-purple-200">
                    Enroll Now
                  </button>
                )}

                <div className="space-y-4">
                  <p className="font-bold text-sm">This course includes:</p>
                  <ul className="text-sm space-y-3 text-gray-600">
                    <li className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4" />{" "}
                      {courseDetails?.lessons.length || 0} videos till now
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="w-4 h-4" /> Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {!enrolled && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex items-center justify-between px-6">
          <div>
            <p className="text-2xl font-black">
              ₹{courseDetails?.price || "499"}
            </p>
            <p className="text-purple-600 font-bold text-xs">
              Limited time offer
            </p>
          </div>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold">
            Enroll
          </button>
        </div>
      )} */}

      {enrolled &&
        courseDetails.lessons &&
        courseDetails.lessons.length > 0 && (
          <div className="mt-12 max-w-7xl mx-auto px-6 pb-16">
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

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600
               transition-all duration-700 ease-out"
                    style={{
                      width: `${
                        courseDetails.lessons.length > 0
                          ? (completedLessons.length /
                              courseDetails.lessons.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
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

                  {openLessonIndex === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      {lesson.videoUrl ? (
                        <ul className="space-y-4">
                          {lesson.videoUrl ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
                              <div className="flex items-center gap-3 flex-1">
                                <PlayCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <span className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                                  {lesson.title || `Video ${index + 1}`}
                                </span>
                              </div>

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
          <div className="mt-10 p-6 bg-green-100 border border-green-300 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🎉 Congratulations You have Completed the Course! 🎉
            </h2>
            <p className="text-green-700">
              {" "}
              You are now eligible for the virtual interview, and you will
              receive your certificate once you pass.{" "}
            </p>
            <button
              onClick={() => {
                navigate(
                  `/interview/${courseDetails.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`
                );
              }}
              className="mt-4 cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Virtual Interview
            </button>
          </div>
        )}

      {enrolled && (
        <div>
          <div className="mt-10 border-t border-gray-200 pt-6 max-w-7xl mx-auto px-6 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              💬 Comments
            </h2>
            <CommentSection courseId={courseId} />
          </div>
        </div>
      )}

      {showDemoModal && (
        <VideoPlayerModal
          videoUrl={courseDetails.demoVideo}
          onClose={() => setShowDemoModal(false)}
        />
      )}

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

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token]);

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
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a public comment..."
          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
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

export default StudentCourseDetails1;
