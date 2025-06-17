import express from 'express';
import { login, register } from "../controllers/authController.js";

const authrouter = express.Router();

authrouter.post("/login", login);

authrouter.post("/register", register);



export default authrouter;