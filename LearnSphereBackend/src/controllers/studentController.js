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

    const publicCourses = courses.filter(course => course.status === "APPROVED" );

    res.status(200).json({ success: true, course:publicCourses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getAllCourse };
