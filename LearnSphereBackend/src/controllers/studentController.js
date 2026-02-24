import Course from "../models/courseModel.js";
import Progress from "../models/Progress.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import jwt, { decode } from "jsonwebtoken";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ status: "APPROVED" })
      .populate("teacher", "username");

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    const formattedCourses = courses.map((course) => ({
      id: course._id,
      name: course.title,
      description: course.description,
      lessons: `${course.lessons?.length || 0} videos`,
      price: course.price,
      image: course.thumbnail,
      teacher: course.teacher?.username || "Unknown",
      enrolled: course.students?.length || 0,
      topic: course.topic,
      topicCover: course.topicCover,
    }));

    const groupedCourses = Object.values(
      formattedCourses.reduce((acc, course) => {
        if (!acc[course.topic]) {
          acc[course.topic] = {
            topic: course.topic,
            course: [],
          };
        }
        acc[course.topic].course.push(course);
        return acc;
      }, {})
    );

    return res.status(200).json({
      success: true,
      data: groupedCourses,
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId)
      .populate("teacher", "username");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let enrolled = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.id;

        enrolled = course.students.some(
          (id) => id.toString() === studentId.toString()
        );
      } catch (err) {
        console.warn("Invalid token:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      course,
      enrolled,
    });

  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const enrollCourse = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { courseId } = req.body;

    if (!courseId || !token) {
      return res.status(400).json({
        success: false,
        message: "Course ID and token required",
      });
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message:
          jwtError.name === "TokenExpiredError"
            ? "Token expired. Please log in again."
            : "Invalid token. Please log in again.",
      });
    }

    const studentId = decoded.id;

    const [student, course] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
    ]);

    if (!student || student.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ FIX: Proper ObjectId comparison
    const alreadyEnrolledInCourse = course.students.some(
      (id) => id.toString() === studentId.toString()
    );

    if (alreadyEnrolledInCourse) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // ✅ Prevent duplicate in student.courses
    const alreadyInStudent = student.courses.some(
      (c) => c.course.toString() === courseId.toString()
    );

    if (alreadyInStudent) {
      return res.status(400).json({
        success: false,
        message: "Enrollment record already exists",
      });
    }

    // ✅ Push correctly structured object
    course.students.push(studentId);

    student.courses.push({
      course: courseId,
      percentageGained: 0,
      attempts: 0,
      dateOfCompletion: null,
      isValidforCertificate: false,
    });

    await Promise.all([course.save(), student.save()]);

    return res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course",
    });

  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during enrollment",
    });
  }
};

const getInfo = async (req, res) => {
  const { studentId } = req.body;
  try {
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required" });
    } else {
      const student = await User.findById(studentId);
      if (!student || student.role !== "STUDENT") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }
      return res.status(200).json({ success: true, student });
    }
  } catch (error) {
    console.error("Error fetching student info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

async function GetUserRegisteredCourse(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;
    if (!studentId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const user = await User.findById(studentId).populate("courses");
    const registeredCourses = user.courses;
    return res.json({
      success: true,
      registeredCourses,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const getTeacherName = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) {
      return res
        .status(400)
        .json({ success: false, message: "Teacher ID is required" });
    }
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "TEACHER") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }
    return res
      .status(200)
      .json({ success: true, teacherName: teacher.username });
  } catch (error) {
    console.error("Error fetching teacher name:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const markAsDone = async (req, res) => {
  const { token, courseId, videoId } = req.body;
  try {
    if (!token || !courseId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "Token, Course ID, and Video ID are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    if (decoded.role !== "STUDENT") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Access is denied" });
    }
    const studentId = decoded.id;

    const progress = await Progress.findOne({
      userId: studentId,
      courseId: courseId,
    });

    if (progress) {
      if (
        !progress.completedLessons.some((lesson) => lesson.videoId === videoId)
      ) {
        progress.completedLessons.push({ videoId });
        await progress.save();
      }
    } else {
      const newProgress = new Progress({
        userId: studentId,
        courseId: courseId,
        completedLessons: [{ videoId }],
      });
      await newProgress.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Lesson marked as done" });
  } catch (error) {
    console.error("Error marking lesson as done:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const checkForProgress = async (req, res) => {
  const { token, courseId } = req.body;
  try {
    if (!token || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Token and Course ID are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    if (decoded.role !== "STUDENT") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Access is denied" });
    }
    const studentId = decoded.id;

    const progress = await Progress.findOne({
      userId: studentId,
      courseId: courseId,
    });

    if (progress) {
      return res
        .status(200)
        .json({ success: true, completedLessons: progress.completedLessons });
    } else {
      return res.status(200).json({ success: true, completedLessons: [] });
    }
  } catch (error) {
    console.error("Error checking progress:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const sendFeedback = async (req, res) => {
  const { token, courseId, rating, feedback } = req.body;

  try {
    if (!token || !courseId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Token, Course ID, and Rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Only students can rate courses",
      });
    }

    const studentId = decoded.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isEnrolled = course.students.some(
      (id) => id.toString() === studentId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const alreadyRated = course.ratings.find(
      (r) => r.student.toString() === studentId.toString()
    );

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this course",
      });
    }

    course.ratings.push({
      student: studentId,
      rating,
      feedback: feedback || "",
    });

    const totalRating = course.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    course.overallRating = totalRating / course.ratings.length;

    await course.save();

    const teacherCourses = await Course.find({
      teacher: course.teacher,
    });

    const teacherTotal = teacherCourses.reduce(
      (sum, c) => sum + (c.overallRating || 0),
      0
    );

    const teacher = await User.findById(course.teacher);

    if (teacher && teacher.teacherDetails) {
      teacher.teacherDetails.rating =
        teacherCourses.length > 0
          ? teacherTotal / teacherCourses.length
          : 0;

      await teacher.save();
    }

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error in sendFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  getAllCourse,
  getCourseDetails,
  enrollCourse,
  getInfo,
  GetUserRegisteredCourse,
  getTeacherName,
  markAsDone,
  checkForProgress,
  sendFeedback,
};
