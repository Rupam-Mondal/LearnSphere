import Course from "../services/courseModel.js";
import User from "../services/userModel.js";
import jwt from "jsonwebtoken";

const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, token } = req.body;

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

    let course = await Course.findOne({ title, teacherid });
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
      teacher:teacherid,
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

export { createCourse };
