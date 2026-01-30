import Comment from "../models/Comments.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// ✅ Helper: extract token
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

// ✅ Create a new comment (students can comment)
export const addComment = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { courseID, text } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    if (!courseID || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID and comment text required" });
    }

    const course = await Course.findById(courseID);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const comment = new Comment({
      userID,
      courseID,
      text,
    });

    await comment.save();

    // Populate username before sending back
    await comment.populate("userID", "username");

    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get all comments for a specific course (with usernames)
export const getCommentsByCourse = async (req, res) => {
  try {
    const { courseID } = req.body;
    if (!courseID) {
      return res.status(400).json({ success: false, message: "Course ID required" });
    }

    const comments = await Comment.find({ courseID })
      .populate("userID", "username email") // main commenter
      .populate("replies.user", "username email") // reply authors
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Add reply (ONLY teachers can reply)
export const addReply = async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    const { commentID, text } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Find the user to check role
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role?.toLowerCase()!== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can reply to comments" });
    }

    if (!commentID || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Comment ID and reply text required" });
    }

    const comment = await Comment.findById(commentID);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Add reply
    comment.replies.push({ user: userID, text });
    await comment.save();

    // Populate reply usernames
    await comment.populate("replies.user", "username email");

    res.status(200).json({ success: true, message: "Reply added", comment });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
