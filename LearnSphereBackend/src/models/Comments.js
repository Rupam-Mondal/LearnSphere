import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    text:{
        type: String,
        required: true,
    },
    replies: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            text: {
                type: String,
                required: true,
            },
        },
    ],
} , { timestamps: true  });

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
