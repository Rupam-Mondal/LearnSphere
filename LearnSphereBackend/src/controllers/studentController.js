import Course from "../services/courseModel.js";
import User from "../services/userModel.js";
import jwt from "jsonwebtoken";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

const getAllCourse = async (req, res) => {
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

    const user = await User.findById(studentId);
    if (!user || user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const courses = await Course.find({});
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }

    const publicCourses = courses.filter(
      (course) => course.status === "APPROVED"
    );

    const coursesWithTeacher = await Promise.all(
      publicCourses.map(async (course) => {
        const teacher = await User.findById(course.teacher);
        return {
          ...course.toObject(),
          teacherName: teacher?.username || "Unknown",
        };
      })
    );

    res.status(200).json({ success: true, course: coursesWithTeacher });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { courseId } = req.body;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const teacher = await User.findById(course.teacher);
    const courseDetails = {
      ...course.toObject(),
      teacherName: teacher?.username || "Unknown",
    };

    let enrolled = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const studentId = decoded.id;

        enrolled = course.students.some(
          (studentIdFromCourse) => studentIdFromCourse.toString() === studentId
        );
      } catch (err) {
        console.warn("Invalid token for enrollment check:", err.message);
      }
    }

    res.status(200).json({ success: true, course: courseDetails, enrolled });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { courseId } = req.body;

    if (!courseId || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID and token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token expired. Please log in again.",
          });
      }
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
    }

    const studentId = decoded.id;

    const [student, course] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
    ]);

    if (!student || student.role !== "STUDENT") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    if (course.students.includes(studentId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are already enrolled in this course.",
        });
    }

    course.students.push(studentId);
    student.courses.push(courseId);

    await Promise.all([course.save(), student.save()]);

    res
      .status(200)
      .json({ success: true, message: "Successfully enrolled in the course." });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error during enrollment.",
      });
  }
};

export { getAllCourse, getCourseDetails, enrollCourse };
