import Course from "../services/courseModel.js";
import User from "../services/userModel.js";
import jwt from "jsonwebtoken";

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

    // Fetch teacher names for each course
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
    const { courseId, token } = req.body;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (
      courseDetails.students &&
      !courseDetails.students.includes(decoded.id)
    ) {
      return res
        .status(200)
        .json({ success: true, enrolled: false, course: courseDetails });
    }

    if (courseDetails.students.includes(decoded.id)) {
      res
        .status(200)
        .json({ success: true, enrolled: true, course: courseDetails });
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { courseId, token } = req.body;
    if (!courseId || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID and token are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const studentId = decoded.id;
    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (course.students.includes(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });
    }
    course.students.push(studentId);
    await course.save();
    student.courses.push(courseId);
    await student.save();
    res
      .status(200)
      .json({ success: true, message: "Successfully enrolled in the course" });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getAllCourse, getCourseDetails, enrollCourse };
