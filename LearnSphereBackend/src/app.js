import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import airouter from "./routes/aiRoute.js";
import authrouter from "./routes/authRoute.js";
import teacherRouter from "./routes/teacherRoute.js";
import adminRouter from "./routes/adminRoute.js";
import studentRouter from "./routes/studentRoute.js";
import commentRouter from "./routes/commentRoute.js";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://learn-sphere-7kcz.vercel.app", // deployed frontend
    ],
    credentials: true, // VERY IMPORTANT
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the LearnSphere Backend!");
});



app.use("/api/ai", airouter);
app.use("/api/auth", authrouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/comment", commentRouter);

export default app;
