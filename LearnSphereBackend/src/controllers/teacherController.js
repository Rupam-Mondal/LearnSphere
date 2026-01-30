import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const createCourse = async (req, res) => {
  try {
    const { topic, title, description, price, thumbnail, token, demoVideo } =
      req.body;

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
      topic,
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
    await User.findByIdAndUpdate(
      teacherid,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    await user.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: { title, description, price, thumbnail, teacher: teacherName },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const { token } = req.body;

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
    const courses = await Course.find({ teacher: teacherid });
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }
    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCourseInfo = async (req, res) => {
  try {
    const { courseId, token } = req.body;

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

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course info:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const uploadLesson = async (req, res) => {
  try {
    const { courseId, title, videoUrl, token, resources } = req.body;

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

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const newLesson = {
      videoId: courseId + "-" + title.replace(/\s+/g, "-").toLowerCase(),
      title,
      videoUrl,
      resources: resources || [],
    };

    course.lessons.push(newLesson);
    await course.save();

    res
      .status(200)
      .json({ success: true, message: "Lesson uploaded successfully" });
  } catch (error) {
    console.error("Error uploading lesson:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId, token } = req.body;

    if (!token || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: token or lesson ID.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherid = decoded.id;

    const user = await User.findById(teacherid);
    if (!user || user.role !== "TEACHER") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not authorized to delete lessons.",
      });
    }

    const course = await Course.findOne({ "lessons.videoId": lessonId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Lesson or associated course not found.",
      });
    }

    course.lessons = course.lessons.filter(
      (lesson) => lesson.videoId !== lessonId
    );
    await course.save();

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const GetAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "TEACHER",
    });

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const teacherRegistration = async (req, res) => {
  try {
    const { username, email, password, role, profilePicture, teacherDetails } =
      req.body;

    const existingUser = await User.findOne({ email, role: "TEACHER" });
    const existingMobile = await User.findOne({ "teacherDetails.mobileNumber": teacherDetails.mobileNumber, role: "TEACHER" });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this mobile number already exists",
      });
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this email already exists",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newTeacher = new User({
      username,
      email,
      password: hashedPassword,
      role: "TEACHER",
      profilePicture,
      teacherDetails: {
        approved: "pending",
        rating: 0,
        qualification: teacherDetails.qualification,
        experience: teacherDetails.experience,
        specialization: teacherDetails.specialization,
        qualificationProof: teacherDetails.qualificationProof,
        mobileNumber: teacherDetails.mobileNumber,
        experienceProof: teacherDetails.experienceProof,
      },
    });
    await newTeacher.save();

    const token = jwt.sign(
      {
        id: newTeacher._id,
        role: newTeacher.role,
        username: newTeacher.username,
        email: newTeacher.email,
        profilePicture: newTeacher.profilePicture,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      token,
      user: newTeacher,
      message: "Teacher registered successfully",
    });
  } catch (error) {
    console.error("Error during teacher registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "TEACHER" });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      token,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during teacher login:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTeacherWithCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const data = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(teacherId) }
      },

      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "teacher",
          as: "courses"
        }
      },

      // IMPORTANT: keep teacherDetails + profilePicture
      {
        $project: {
          password: 0,
          __v: 0,
          "courses.__v": 0
        }
      }
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.json({
      success: true,
      data: data[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




export {
  teacherLogin,
  GetAllTeachers,
  createCourse,
  getCourses,
  getCourseInfo,
  uploadLesson,
  deleteLesson,
  teacherRegistration,
  getTeacherWithCourses,
};
