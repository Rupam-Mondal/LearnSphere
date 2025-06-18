import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/configs/db.js";
dotenv.config();

app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    await connectDB();
});