import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import airouter from "./routes/aiRoute.js";
import authrouter from "./routes/authRoute.js";
import teacherRouter from "./routes/teacherRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("Received a request at the root endpoint.");
  res.send("Welcome to the LearnSphere Backend!");
});

app.use("/api/ai", airouter);
app.use("/api/auth", authrouter);
app.use("/api/teacher", teacherRouter);


export default app;
