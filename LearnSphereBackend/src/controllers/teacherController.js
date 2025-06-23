import Course from "../services/courseModel.js";
import User from "../services/userModel.js";
import jwt from "jsonwebtoken";

const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, token, demoVideo } = req.body;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized access" });
        }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherid = decoded.id;
    if (!teacherid) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    
    const user = await User.findById(teacherid);
    if (!user || user.role !== "TEACHER") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ success: false, message: "These fields are required" });
    }

    let course = await Course.findOne({ title, teacher: teacherid });

    if (course) {
      return res
        .status(400)
        .json({ success: false, message: "Course already exists" });
    }

    let newCourse = new Course({
      title,
      description,
      price,
      thumbnail:
        thumbnail ||
        "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
      demoVideo: demoVideo || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      teacher: teacherid,
    });
    await newCourse.save();
    
    const teacherName = user.username;
    await User.findByIdAndUpdate(teacherid, {
        $push: { courses: newCourse._id },
    }, { new: true });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: { title, description, price, thumbnail, teacher:teacherName },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCourses = async (req, res) => {
  try{
    const {token} = req.body;
    
    if(!token) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherid = decoded.id;
    if (!teacherid) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const user = await User.findById(teacherid);
    if (!user || user.role !== "TEACHER") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    const courses = await Course.find({ teacher: teacherid });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "No courses found" });
    }
    res.status(200).json({ success: true, courses });

  }catch(error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const getCourseInfo = async (req, res) => {
  try {
    const { courseId, token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherid = decoded.id;

    if (!teacherid) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(teacherid);
    if (!user || user.role !== "TEACHER") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course info:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { createCourse, getCourses, getCourseInfo };
