import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/aiRoute.js";
import connectDB from "./configs/db.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

await connectDB();

app.get("/", (req, res) => {
    console.log("Received a request at the root endpoint.");
  res.send("Welcome to the LearnSphere Backend!");
});

app.use("/api/ai",router);



export default app;
