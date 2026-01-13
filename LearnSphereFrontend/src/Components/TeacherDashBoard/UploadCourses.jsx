import React, { useState } from "react";
import { Plus, X, Video, List, Loader2, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const LessonUploaderForm = ({ onClose, onSuccess }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadMode, setUploadMode] = useState("file");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

  const courseId = window.location.pathname.split("/").pop();

  // ---- Cloudinary Video Upload ----
  const VideoHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("Please select a video file.");

    setUploadingVideo(true);
    setMessage("⏳ Uploading video ...");

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "LearnSphereVideo_Preset");
    form.append("cloud_name", "dyjzfkkxl");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_COLUDINARY_URL}/video/upload`,
        form
      );
      const videoLink = response.data.secure_url;
      setUploadedVideoUrl(videoLink);
      setVideoUrl(videoLink);
      setMessage("✅ Video uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("❌ Video upload failed. Try again.");
    } finally {
      setUploadingVideo(false);
    }
  };

  // ---- Lesson Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl || !title)
      return setMessage("❌ Title and video are required.");

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Authentication error: Please sign in again.");
        setIsLoading(false);
        return;
      }

      const payload = {
        courseId,
        title,
        videoUrl,
        token,
        resources: resourceLink,
      };

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/upload-lesson`,
        payload
      );

      if (result.data?.success) {
        setMessage("✅ Lesson uploaded successfully!");
        onSuccess({
          _id: result.data.lessonId || Date.now(),
          title,
          duration: "N/A",
          type: "Video",
          videoUrl,
          resourceLink,
        });
        setTimeout(onClose, 1500);
      } else {
        setMessage(
          `❌ Upload failed: ${result.data?.message || "Unknown error."}`
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage(
        `❌ Failed to upload lesson: ${error.message || "Network error."}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6 w-[50vw] max-w-md mx-auto border-t-4 border-purple-500 animate-slide-in">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center">
          <Video className="h-6 w-6 mr-3 text-purple-600" />
          Upload New Lesson
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Close form"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Upload Mode Switch */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode("link")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
            uploadMode === "link"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Paste Video Link
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("file")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
            uploadMode === "file"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Upload Video File
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson Title (e.g., Module 1: Setup)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          required
        />

        {/* Conditional Input */}
        {uploadMode === "link" ? (
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste Video URL (YouTube, Vimeo, etc.)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            required
          />
        ) : (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={VideoHandler}
              className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {uploadingVideo && (
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Uploading...
              </p>
            )}
            {uploadedVideoUrl && (
              <p className="text-green-600 text-sm mt-2">
                ✅ Uploaded:{" "}
                <video
                  src={uploadedVideoUrl}
                  className="mt-2 w-full rounded-lg shadow-md h-[240px]" controls>
                  {/* <source src={uploadedVideoUrl} type="video/mp4" /> */}

                  Your browser does not support the video tag.
                </video>
              </p>
            )}
          </div>
        )}

        {/* Resource link */}
        <input
          type="url"
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="Optional: Resource File Link (PDF, Docs, etc.)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-bold text-white transition duration-300 shadow-lg ${
            isLoading
              ? "bg-purple-400 cursor-not-allowed flex items-center justify-center"
              : "bg-purple-600 hover:bg-purple-700 hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-3" /> Uploading...
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" /> Add Lesson
            </div>
          )}
        </button>
      </form>

      {message && (
        <p
          className={`text-center font-semibold rounded-lg p-2 ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

const UploadCourses = ({ course }) => {
  const initialLessons = course?.lessons || [];
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lessons, setLessons] = useState(initialLessons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [previewVideoTitle, setPreviewVideoTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleLessonSuccess = (newLesson) => {
    newLesson.id = newLesson._id || Date.now();
    setLessons((prev) => [...prev, newLesson]);
    handleCloseForm();
  };

  const handleDeleteLesson = async (lessonId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lesson? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(lessonId);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error: Please sign in again.");
        return;
      }

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/delete-lesson`,
        {
          lessonId,
          token,
        }
      );

      if (result.data?.success) {
        setLessons((prev) =>
          prev.filter((lesson) => (lesson._id || lesson.id) !== lessonId)
        );
        toast.success("✅ Lesson deleted successfully!");
      } else {
        toast.error(
          `❌ Deletion failed: ${result.data?.message || "Unknown error."}`
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        `❌ Failed to delete lesson: ${
          error.message || "Internal network error."
        }`
      );
    } finally {
      setIsDeleting(null);
      window.location.reload();
    }
  };

  const openVideoPreview = (url, title) => {
    let embedUrl = "";

    if (url.includes("youtube.com/watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/").split("&")[0];
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      embedUrl = url;
    }

    setPreviewVideoUrl(embedUrl);
    setPreviewVideoTitle(title);
    setIsModalOpen(true);
  };

  const closeVideoPreview = () => {
    setIsModalOpen(false);
    setPreviewVideoUrl("");
    setPreviewVideoTitle("");
  };

  const hasLessons = lessons.length > 0;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
            {/* Lesson List Header */}     
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <List className="h-7 w-7 mr-3 text-indigo-500" />         
          Course Lessons ({lessons.length} Modules)
        </h3>
                {/* Dedicated Upload Button */}
        <button
          onClick={handleOpenForm}
          className="
            bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl
            shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02]
            flex items-center space-x-2 text-sm focus:outline-none focus:ring-4 focus:ring-purple-300
          "
        >
                    <Plus className="h-5 w-5" /> <span>Upload New Video</span> 
               
        </button>
             
      </div>
         
      {hasLessons ? (
        <div className="space-y-3">
           
          {lessons.map((lesson, index) => {
            const lessonKey = lesson.videoId;
            const isCurrentLessonDeleting = isDeleting === lessonKey;

            return (
              <div
                key={lessonKey}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-green-500 hover:bg-gray-100 transition duration-200"
              >
                     
                <div className="flex items-center space-x-3">
                         
                  <Video className="h-6 w-6 text-green-600 flex-shrink-0" />   
                     
                  <div>
                             
                    <p className="font-semibold text-gray-900">
                                          {index + 1}. {lesson.title}           
                           
                    </p>
                             
                    
                           
                  </div>
                       
                </div>
                     {/* Action Buttons for Preview, Resource, and DELETE */}   
                         
                <div className="flex items-center space-x-3">
                                  {/* Video Preview Button */}       
                  {lesson.videoUrl ? (
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      onClick={() =>
                        openVideoPreview(lesson.videoUrl, lesson.title)
                      }
                    >
                                          View        
                    </button>
                  ) : (
                    <span className="text-red-500 text-xs font-medium border border-red-200 rounded-md px-2 py-1">
                                          URL Missing          
                    </span>
                  )}
                                  {/* Resource Link Button */}       
                  {lesson.resourceLink && (
                    <a
                      href={lesson.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                    >
                                          <FileText className="h-4 w-4 mr-1" />
                      Resource          
                    </a>
                  )}
                                  {/* 3. NEW ELEMENT: Delete Button */}         
                       
                  <button
                    onClick={() => handleDeleteLesson(lessonKey)}
                    disabled={isCurrentLessonDeleting}
                    className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center ${
                      isCurrentLessonDeleting
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                             
                    {isCurrentLessonDeleting ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                                      Delete        
                  </button>
                       
                </div>
                   
              </div>
            );
          })}
        </div>
      ) : (
        // UI for when no lessons are uploaded
        <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" /> 
          <p className="text-xl font-bold text-gray-800 mb-2">
                        No Course Content Yet  
          </p>
           
          <p className="text-gray-600 mb-4">
                        Start by uploading your first video lesson or module
            content.  
          </p>
           
          <button
            onClick={handleOpenForm}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 focus:ring-4 focus:ring-green-300 flex items-center mx-auto"
          >
                        <Plus className="h-5 w-5 mr-2" /> Upload First Lesson  
          </button>
        </div>
      )}
            {/* --- End Lesson Display Section --- */}     
      {/* Conditional Modal Overlay for the Lesson Upload Form (Unchanged) */} 
         
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={handleCloseForm}
        >
           
          <div onClick={(e) => e.stopPropagation()}>
               
            <LessonUploaderForm
              onClose={handleCloseForm}
              onSuccess={handleLessonSuccess}
              courseId={course?.id}
            />
             
          </div>
        </div>
      )}
            {/* --- VIDEO PREVIEW MODAL (Unchanged) --- */}     
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={closeVideoPreview}
        >
           
          <div
            className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-3xl relative transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
               
            <button
              onClick={closeVideoPreview}
              className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full p-2.5 text-xl shadow-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 z-10"
              aria-label="Close video"
            >
                            <X className="h-6 w-6" />   
            </button>
               
            <h4 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                            {previewVideoTitle}   
            </h4>
               
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-inner ring-2 ring-gray-100">
                   
              <iframe
                src={previewVideoUrl}
                title={previewVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
                 
            </div>
             
          </div>
        </div>
      )}
            {/* --- END VIDEO PREVIEW MODAL --- */}   
    </div>
  );
};

export default UploadCourses;
