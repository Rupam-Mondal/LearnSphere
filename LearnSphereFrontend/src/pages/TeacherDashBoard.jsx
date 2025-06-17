import React, { useState } from "react";
import axios from "axios";

const TeacherDashBoard = () => {
  const id = "12345";
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState(1000);
  const [courseDescription, setCourseDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseVideo, setCourseVideo] = useState(null);

  const ImageHandler = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }
    console.log(file);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "LearnSphereImage_Preset");
    form.append("cloud_name", "dyjzfkkxl");

    try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dyjzfkkxl/image/upload",
          form
        );
        console.log(response.data);
        setCourseThumbnail(response.data.secure_url);
    } catch (error) {}

    setLoading(false);
  };

  const VideoHandler = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }
    console.log(file);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "LearnSphereVideo_Preset");
    form.append("cloud_name", "dyjzfkkxl");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dyjzfkkxl/video/upload",
        form
      );
      console.log(response.data);
      setCourseVideo(response.data.secure_url);
      // setCourseThumbnail(response.data.secure_url);
    } catch (error) {}

    setLoading(false);
  }

  const handleSubmit = (e) => {
    alert("Course created successfully");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <h1 className="text-lg mb-6">Teacher Id : {id}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          className="block w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Course Price
        </label>
        <input
          type="number"
          className="block w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter course price"
          value={coursePrice}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1000) {
              setCoursePrice(value);
            } else {
              alert("Price cannot be less than 1000");
            }
          }}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="block w-full p-2 border border-gray-300 rounded mb-4"
          rows="4"
          placeholder="Enter course description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        ></textarea>

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">
          Course Thumbnail
        </label>
        <input
          type="file"
          className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
          accept="image/*"
          onChange={ImageHandler}
        />
        {courseThumbnail && (
          <img
            src={courseThumbnail}
            alt="Course Thumbnail"
            className="mt-2 mb-2 w-full h-48 object-cover rounded"
          />
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">
          Course Video
        </label>
        <input
          type="file"
          className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
          accept="video/*"
          onChange={VideoHandler}
        />
        {courseVideo && (
          <video
            src={courseVideo}
            controls
            className="mt-2 mb-2 w-full h-48 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading ..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default TeacherDashBoard;
