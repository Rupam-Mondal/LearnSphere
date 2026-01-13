import Course from "../services/courseModel.js";
import Progress from "../services/Progress.js";
import User from "../services/userModel.js";
import jwt, { decode } from "jsonwebtoken";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ status: "APPROVED" });

    if (!courses.length) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }

    const coursesWithTeacher = await Promise.all(
      courses.map(async (course) => {
        const teacher = await User.findById(course.teacher).select("username");

        return {
          id: course._id,
          name: course.title,
          description: course.description,
          lessons: `${course.lessons?.length || 0} videos`,
          price: course.price,
          image: course.thumbnail,
          teacher: teacher?.username || "Unknown",
          enrolled: course.students?.length || 0,
          topic: course.topic,
          topicCover: course.topicCover
        };
      })
    );

    const groupedCourses = Object.values(
      coursesWithTeacher.reduce((acc, course) => {
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

    res.status(200).json({
      success: true,
      data: groupedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
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
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(courseId).populate("lessons teacher");
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
        return res.status(401).json({
          success: false,
          message: "Token expired. Please log in again.",
        });
      }
      return res.status(401).json({
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
      return res.status(400).json({
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
    res.status(500).json({
      success: false,
      message: "Internal Server Error during enrollment.",
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
      return res
        .status(400)
        .json({
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

const checkForProgress =  async (req,res) =>{
  const {token, courseId} = req.body;
  try{
    if (!token || !courseId) {
      return res
        .status(400)
        .json({
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
      return res
        .status(200)
        .json({ success: true, completedLessons: [] });
    }
  }
  catch(error){
    console.error("Error checking progress:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export {
  getAllCourse,
  getCourseDetails,
  enrollCourse,
  getInfo,
  GetUserRegisteredCourse,
  getTeacherName,
  markAsDone,
  checkForProgress,
};
