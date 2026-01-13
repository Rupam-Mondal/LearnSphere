import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import toast from "react-hot-toast";
import { FiUploadCloud, FiBook, FiDollarSign, FiAlignLeft, FiPlayCircle, FiList, FiPlus, FiTrash2 } from "react-icons/fi";
import { IndianRupee } from "lucide-react";

const CreateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);

  // Existing States
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState(1000);
  const [courseDescription, setCourseDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [courseVideo, setCourseVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // New States based on Schema
  const [topic, setTopic] = useState("");
  const [topicCover, setTopicCover] = useState(["", "", ""]); // Starts with 3 empty points

  const categories = [
    "Web Development", "Data Science", "Mobile Development", 
    "Design", "Marketing", "Business", "Personal Development"
  ];

  useEffect(() => {
    if (user && (user?.role !== "TEACHER" || user?.teacherDetails?.approved.toUpperCase() !== "APPROVED")) {
      toast.error("You are not authorized to access this page");
      navigate("/teacher-home");
    }
  }, [user, navigate]);

  
  const handlePointChange = (index, value) => {
    const newPoints = [...topicCover];
    newPoints[index] = value;
    setTopicCover(newPoints);
  };

  const addPoint = () => setTopicCover([...topicCover, ""]);
  const removePoint = (index) => {
    if (topicCover.length > 3) {
      setTopicCover(topicCover.filter((_, i) => i !== index));
    } else {
      toast.error("Minimum 3 points are required");
    }
  };

  const uploadToCloudinary = async (file, resourceType) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", resourceType === "video" ? import.meta.env.VITE_COLUDINARY_UPLOAD_PRESET : import.meta.env.VITE_COLUDINARY_UPLOAD_PRESET);
    form.append("cloud_name", resourceType === "video" ? import.meta.env.VITE_COLUDINARY_CLOUD_NAME : import.meta.env.VITE_COLUDINARY_CLOUD_NAME);

    const res = await axios.post(`${import.meta.env.VITE_COLUDINARY_URL}/${resourceType}/upload`, form);
    return res.data.secure_url;
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file, type);
      type === "image" ? setCourseThumbnail(url) : setCourseVideo(url);
      toast.success(`${type === "image" ? "Thumbnail" : "Video"} uploaded!`);
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const filledPoints = topicCover.filter(p => p.trim() !== "");
    if (!courseName || !topic || filledPoints.length < 3 || !courseDescription) {
      return toast.error("Please fill all fields. Topic cover needs at least 3 points.");
    }

    setLoading(true);
    const courseData = {
      title: courseName,
      topic: topic,
      topicCover: filledPoints,
      description: courseDescription,
      price: coursePrice,
      thumbnail: courseThumbnail,
      demoVideo: courseVideo,
      token: token || localStorage.getItem("token"),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/teacher/create-course`, courseData);
      toast.success("Course launched successfully!");
      navigate(`/teacher-dashboard/${id}`);
    } catch (error) {
      toast.error("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all";
  const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 py-8 px-10 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Launch Your Course</h1>
              <p className="text-indigo-100 mt-2">Set up your curriculum and details.</p>
            </div>
            <div className="hidden md:block bg-indigo-500/30 p-4 rounded-2xl border border-indigo-400/20 text-xs">
              Status: <span className="font-bold">TEACHER-APPROVED</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-6">
                <div>
                  <label className={labelClass}><FiBook /> Course Title</label>
                  <div className="relative">
                    <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className={inputClass} value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Enter course title" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}><FiList /> Course Category (Topic)</label>
                  <div className="relative">
                    <FiList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      className={`${inputClass} appearance-none cursor-pointer`}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="">Select a topic</option>
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}><IndianRupee /> Price (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" className={inputClass} value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}><FiAlignLeft /> Description</label>
                  <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows="4" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="What is this course about?" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 ml-1"><FiList /> What students will learn</label>
                    <button type="button" onClick={addPoint} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"><FiPlus /> Add</button>
                  </div>
                  <div className="space-y-3">
                    {topicCover.map((point, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder={`Point ${index + 1}`}
                          value={point}
                          onChange={(e) => handlePointChange(index, e.target.value)}
                        />
                        <button type="button" onClick={() => removePoint(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}><FiUploadCloud /> Thumbnail</label>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${courseThumbnail ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-indigo-400'}`}>
                    {courseThumbnail ? (
                      <img src={courseThumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <div className="py-4 text-xs text-gray-500"><FiUploadCloud className="mx-auto text-2xl mb-1" /> Upload Image</div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
                  </div>
                </div>

                {/* Demo Video Upload */}
                <div>
                  <label className={labelClass}><FiPlayCircle /> Demo Video</label>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${courseVideo ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-indigo-400'}`}>
                    {courseVideo ? (
                      <div className="text-xs text-green-600 font-bold py-4 underline">Video Uploaded Successfully!</div>
                    ) : (
                      <div className="py-4 text-xs text-gray-500"><FiPlayCircle className="mx-auto text-2xl mb-1" /> Upload Demo</div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" onChange={(e) => handleFileChange(e, "video")} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"}`}
            >
              {loading ? "Processing..." : "Launch Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;