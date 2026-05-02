import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import crypto from "node:crypto";
import DoubtSession from "../models/doubtSessionModel.js";

const createCourse = async (req, res) => {
  try {
    const {
      topic,
      title,
      description,
      price,
      topicCover,
      thumbnail,
      token,
      demoVideo,
      assessmentType,
    } = req.body;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherid = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(teacherid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const user = await User.findById(teacherid);
    if (!user || user.role !== "TEACHER") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (
      !title ||
      !description ||
      !price ||
      !Array.isArray(topicCover) ||
      topicCover.length < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existing = await Course.findOne({ title, teacher: teacherid });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const newCourse = await Course.create({
      topic,
      title,
      description,
      price,
      topicCover,
      thumbnail:
        thumbnail ||
        "https://instructor-academy.onlinecoursehost.com/content/images/2020/10/react-2.png",
      demoVideo: demoVideo || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      assessmentType,
      teacher: teacherid,
    });

    await User.findByIdAndUpdate(teacherid, {
      $addToSet: {
        courses: {
          course: newCourse._id,
          percentageGained: 0,
          attempts: 0,
          dateOfCompletion: null,
          isValidforCertificate: false,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });

  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
      (lesson) => lesson.videoId !== lessonId,
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
    const teachers = await User.aggregate([
      {
        $match: {
          role: "TEACHER",
          $expr: {
            $eq: [{ $toLower: "$teacherDetails.approved" }, "approved"],
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$teacher", "$$teacherId"] },
                status: "APPROVED",
              },
            },
            {
              $project: {
                title: 1,
                topic: 1,
                thumbnail: 1,
                price: 1,
                overallRating: 1,
                students: 1,
              },
            },
            { $sort: { overallRating: -1, createdAt: -1 } },
          ],
          as: "courses",
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
          "courses.__v": 0,
        },
      },
      {
        $sort: {
          "teacherDetails.rating": -1,
          username: 1,
        },
      },
    ]);

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
    const existingMobile = await User.findOne({
      "teacherDetails.mobileNumber": teacherDetails.mobileNumber,
      role: "TEACHER",
    });
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
      process.env.JWT_SECRET,
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
      process.env.JWT_SECRET,
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
        $match: { _id: new mongoose.Types.ObjectId(teacherId) },
      },

      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "teacher",
          as: "courses",
        },
      },

      // IMPORTANT: keep teacherDetails + profilePicture
      {
        $project: {
          password: 0,
          __v: 0,
          "courses.__v": 0,
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      data: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getDoubtSessionRequests = async (req, res) => {
  try {
    const { token, courseId } = req.body;

    if (!token || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Token and Course ID are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "TEACHER") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can view doubt session requests",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      teacher: decoded.id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this teacher",
      });
    }

    const requests = await DoubtSession.find({
      course: courseId,
      teacher: decoded.id,
      status: { $in: ["REQUESTED", "LINK_SENT"] },
    })
      .populate("student", "username email profilePicture")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching doubt session requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getDoubtSessionNotifications = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "TEACHER") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can view doubt session notifications",
      });
    }

    const notifications = await DoubtSession.find({
      teacher: decoded.id,
      status: { $in: ["REQUESTED", "LINK_SENT"] },
    })
      .populate("course", "title")
      .populate("student", "username profilePicture")
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching teacher notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const sendDoubtSessionLink = async (req, res) => {
  try {
    const { token, requestId, scheduledAt } = req.body;

    if (!token || !requestId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Token, request ID, and session time are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "TEACHER") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can send session links",
      });
    }

    const request = await DoubtSession.findById(requestId);
    if (!request || request.teacher.toString() !== decoded.id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Doubt session request not found",
      });
    }

    const parsedScheduledAt = new Date(scheduledAt);
    if (Number.isNaN(parsedScheduledAt.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid session time",
      });
    }

    const roomId =
      request.roomId ||
      `doubt-${request.course.toString()}-${crypto.randomBytes(6).toString("hex")}`;

    request.roomId = roomId;
    request.scheduledAt = parsedScheduledAt;
    request.status = "LINK_SENT";
    await request.save();
    await request.populate("student", "username email profilePicture");

    return res.status(200).json({
      success: true,
      message: "Video session link sent to the student",
      request,
    });
  } catch (error) {
    console.error("Error sending doubt session link:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
  getDoubtSessionRequests,
  getDoubtSessionNotifications,
  sendDoubtSessionLink,
};
