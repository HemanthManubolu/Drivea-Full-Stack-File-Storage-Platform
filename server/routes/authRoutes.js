import express from "express";
import { getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.get("/me", protect, getMe)

export default authRouter;
